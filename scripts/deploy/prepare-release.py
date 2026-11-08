from pathlib import Path
import yaml,json,gzip,tarfile,io,hashlib,base64,subprocess
root=Path.cwd(); ns='science-community'; registry='alisa-registry.cpolar.top'
def meta(n):return {'name':n,'namespace':ns}
resources=[{'apiVersion':'v1','kind':'Namespace','metadata':{'name':ns}}]
for name,typ in [('science-config','Opaque'),('science-registry','kubernetes.io/dockerconfigjson')]:
 resources.append({'apiVersion':'v1','kind':'Secret','metadata':{**meta(name),'annotations':{'argocd.argoproj.io/sync-options':'Prune=false,Delete=false'}},'type':typ,'data':({'.dockerconfigjson':base64.b64encode(b'{"auths":{}}').decode()} if typ=='kubernetes.io/dockerconfigjson' else {})})
for name,port,path in [('community',9091,'/community/community/getAll'),('transfer',9092,'/api/users/online'),('web',3000,'/science')]:
 label={'app.kubernetes.io/name':'science-'+name}
 c={'name':name,'image':registry+'/science-'+name+':release-20261107','ports':[{'name':'http','containerPort':port}], 'env':[{'name':'HOST','valueFrom':{'fieldRef':{'fieldPath':'status.podIP'}}}], 'resources':{'requests':{'cpu':'100m','memory':'256Mi'},'limits':{'cpu':'2','memory':'1Gi'}},'startupProbe':{'httpGet':{'path':path,'port':'http'},'failureThreshold':90,'periodSeconds':5},'readinessProbe':{'httpGet':{'path':path,'port':'http'},'periodSeconds':10}}
 if name!='web':
  c['envFrom']=[{'secretRef':{'name':'science-config'}}]
  c['command']=['java'];c['args']=['-XX:MaxRAMPercentage=70','-jar','/app/science.jar']
 else:c['env']=[{'name':'HOSTNAME','value':'0.0.0.0'},{'name':'PORT','value':'3000'}]
 resources.extend([{'apiVersion':'apps/v1','kind':'Deployment','metadata':meta(name),'spec':{'replicas':1,'selector':{'matchLabels':label},'template':{'metadata':{'labels':label},'spec':{'automountServiceAccountToken':False,'imagePullSecrets':[{'name':'science-registry'}],'containers':[c]}}}}, {'apiVersion':'v1','kind':'Service','metadata':meta(name),'spec':{'selector':label,'ports':[{'name':'http','port':port,'targetPort':'http'}]}}])
for name,prefix,service,port,strip in [('science','/science','web',3000,False),('science-chat','/science-chat','transfer',9092,True)]:
 rule={'matches':[{'path':{'type':'PathPrefix','value':prefix}}],'backendRefs':[{'name':service,'port':port}]}
 if strip:rule['filters']=[{'type':'URLRewrite','urlRewrite':{'path':{'type':'ReplacePrefixMatch','replacePrefixMatch':'/'}}}]
 resources.append({'apiVersion':'gateway.networking.k8s.io/v1','kind':'HTTPRoute','metadata':meta(name),'spec':{'parentRefs':[{'name':'traefik-gateway','namespace':'traefik'}],'hostnames':['alisa.vip.cpolar.cn'],'rules':[rule]}})
Path('deploy/kubernetes/science.yaml').write_text(yaml.safe_dump_all(resources,sort_keys=False))
app={'apiVersion':'argoproj.io/v1alpha1','kind':'Application','metadata':{'name':ns,'namespace':'argocd'},'spec':{'project':'default','source':{'repoURL':'https://github.com/future-alisa/ScienceCommunity.git','targetRevision':'main','path':'deploy/kubernetes'},'destination':{'server':'https://kubernetes.default.svc','namespace':ns},'ignoreDifferences':[{'group':'','kind':'Secret','name':n,'namespace':ns,'jsonPointers':['/data']} for n in ['science-config','science-registry']],'syncPolicy':{'syncOptions':['CreateNamespace=true','RespectIgnoreDifferences=true']}}}
Path('deploy/argocd/application.yaml').write_text(yaml.safe_dump(app,sort_keys=False))
Path('/tmp/science-app-create.json').write_text(json.dumps(app))
# Archive only reviewed frontend source; no environment or credentials.
archive=io.BytesIO()
with tarfile.open(fileobj=archive,mode='w') as tar:
 for p in sorted(Path('App').rglob('*')):
  if any(x in {'node_modules','.next','.next-dev','.git'} for x in p.parts) or p.name.startswith('.env') or p.suffix=='.tsbuildinfo' or not p.is_file():continue
  b=p.read_bytes();info=tarfile.TarInfo(str(p.relative_to('App')));info.size=len(b);info.mode=0o644;tar.addfile(info,io.BytesIO(b))
bundle=gzip.compress(archive.getvalue());print('Frontend bundle bytes:',len(bundle))

cm={'apiVersion':'v1','kind':'ConfigMap','metadata':meta('science-web-build-context'),'binaryData':{'source.tar.gz':base64.b64encode(bundle).decode()}}
job={'apiVersion':'batch/v1','kind':'Job','metadata':meta('science-web-build-20261107'),'spec':{'backoffLimit':0,'activeDeadlineSeconds':2400,'template':{'spec':{'automountServiceAccountToken':False,'restartPolicy':'Never','initContainers':[{'name':'unpack','image':'curlimages/curl:8.17.0','securityContext':{'runAsUser':0},'command':['sh','-c','cat /bundle/part-* | tar -xz -C /workspace'],'volumeMounts':[{'name':'bundle','mountPath':'/bundle'},{'name':'workspace','mountPath':'/workspace'}]}],'containers':[{'name':'build','image':'ghcr.io/osscontainertools/kaniko:v1.29.0','args':['--context=dir:///workspace','--dockerfile=/workspace/Dockerfile','--destination='+registry+'/science-web:release-20261107','--cache=false','--compressed-caching=false','--push-retry=3'],'volumeMounts':[{'name':'workspace','mountPath':'/workspace'},{'name':'registry','mountPath':'/kaniko/.docker','readOnly':True}],'resources':{'requests':{'cpu':'250m','memory':'512Mi'},'limits':{'cpu':'2','memory':'2Gi'}}}],'volumes':[{'name':'bundle','configMap':{'name':cm['metadata']['name']}},{'name':'workspace','emptyDir':{'sizeLimit':'4Gi'}},{'name':'registry','secret':{'secretName':'science-registry','items':[{'key':'.dockerconfigjson','path':'config.json'}]}}]}}}}
chunks=[bundle[i:i+450000] for i in range(0,len(bundle),450000)]
cms=[{'apiVersion':'v1','kind':'ConfigMap','metadata':meta('science-web-context-'+str(i)),'binaryData':{'part-'+str(i).zfill(3):base64.b64encode(b).decode()}} for i,b in enumerate(chunks)]
job['spec']['template']['spec']['volumes'][0]={'name':'bundle','projected':{'sources':[{'configMap':{'name':c['metadata']['name']}} for c in cms]}}
job['spec']['template']['spec']['containers'][0]['args'] += ['--build-arg='+k+'='+v for k,v in {'NEXT_PUBLIC_BASE_PATH':'/science','NEXT_PUBLIC_API_BASE_URL':'/science/community-api','NEXT_PUBLIC_USER_API_BASE_URL':'https://alisa.vip.cpolar.cn/alisa-gateway','NEXT_PUBLIC_CHAT_URL':'https://alisa.vip.cpolar.cn/science-chat/ws','COMMUNITY_API_PROXY_TARGET':'http://community:9091/community'}.items()]
# Local-manifest bootstrap creates only namespace, placeholders, and build inputs.
Path('/tmp/science-bootstrap-sync.json').write_text(json.dumps({'manifests':[json.dumps(x) for x in resources[:3]+cms+[job]],'prune':False}))
