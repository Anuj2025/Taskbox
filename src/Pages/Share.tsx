import React from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";


const Share = () => {
  const editor = useCreateBlockNote();
  const [value, setValue] = React.useState()

  return (
    <>
    <div><BlockNoteView defaultvalue="hello" editor={editor} />
    </div>
    </>
  )
}

export default Share