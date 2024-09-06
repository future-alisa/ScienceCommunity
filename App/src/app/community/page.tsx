"use client";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Tag } from "antd";
import { Card } from "antd";

export default function Page() {
  type GithubIssueItem = {
    url: string;
    id: number;
    number: number;
    title: string;
    labels: {
      name: string;
      color: string;
    }[];
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string;
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "标题",
      dataIndex: "title",
      copyable: true,
      ellipsis: true,
      tooltip: "标题过长会自动收缩",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      disable: true,
      title: "状态",
      dataIndex: "state",
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: "select",
      valueEnum: {
        all: { text: "超长".repeat(50) },
        open: {
          text: "未解决",
          status: "Error",
        },
        closed: {
          text: "已解决",
          status: "Success",
          disabled: true,
        },
        processing: {
          text: "解决中",
          status: "Processing",
        },
      },
    },
    {
      disable: true,
      title: "标签",
      dataIndex: "labels",
      search: false,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>
          {record.labels.map(({ name, color }) => (
            <Tag color={color} key={name}>
              {name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "创建时间",
      key: "showTime",
      dataIndex: "created_at",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      valueType: "dateRange",
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          key="view"
        >
          查看
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => action?.reload()}
          menus={[
            { key: "copy", name: "复制" },
            { key: "delete", name: "删除" },
          ]}
        />,
      ],
    },
  ];
  const { Meta } = Card;
  const data = [1, 2, 3, 4, 5, 6, 7];
  return (
    <div>
      <p>Community</p>
      <div style={styles.div}>
        <div>category</div>
        <div style={styles.grid}>
          {data.map((item, index) => (
            <Card
              style={styles.gridItem}
              key={index}
              hoverable
              cover={
                <img
                  alt="example"
                  src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                />
              }
            >
              <Meta
                title="Europe Street beat"
                description="www.instagram.com"
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  div: {
    border: 1,
    display: "flex",
    justifyContent: "center", // Center items horizontally
    alignItems: "center", // Center items vertically
    flexDirection: "column",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", 
    gap: "10px", // 网格项之间的间距
    padding: "10px",
  },
  gridItem: {
    backgroundColor: "#f0f0f0",
    border: "1px solid #ddd",
    padding: "20px",
    textAlign: "center",
  },
};
