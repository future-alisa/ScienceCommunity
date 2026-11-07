import { Editor, Transforms } from "slate";

export function clipboardImages(data: Pick<DataTransfer, "files" | "items">): File[] {
  const files = Array.from(data.files).filter(file => file.type.startsWith("image/"));
  if (files.length) return files;
  return Array.from(data.items).filter(item => item.kind === "file" && item.type.startsWith("image/"))
    .map(item => item.getAsFile()).filter((file): file is File => file !== null);
}

// A live range follows edits made while the image is uploading.
export async function pasteImages(editor: Editor, files: File[], upload: (file: File) => Promise<string>,
  active: () => boolean, failed: (message: string) => void) {
  const at = editor.selection || Editor.range(editor, Editor.end(editor, []));
  const bookmark = Editor.rangeRef(editor, at, { affinity: "forward" });
  try {
    for (const file of files) {
      if (!active()) break;
      if (file.size > 20 * 1024 * 1024) { failed("图片不能超过20MB"); continue; }
      try {
        const url = await upload(file);
        if (!active()) break;
        const point = bookmark.current || Editor.range(editor, Editor.end(editor, []));
        Editor.withoutNormalizing(editor, () => {
          Transforms.select(editor, point);
          Transforms.insertNodes(editor, [
            { type: "image", url, name: (file.name || "粘贴图片.png").slice(0, 255), children: [{ text: "" }] },
            { type: "paragraph", children: [{ text: "" }] },
          ]);
        });
      } catch (error) { if (active()) failed(error instanceof Error ? error.message : "图片上传失败，请重试"); }
    }
  } finally { bookmark.unref(); }
}
