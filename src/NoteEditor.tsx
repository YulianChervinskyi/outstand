export interface INoteEditorProps {
    text: string,
    onChange: (e: { text: string }) => void,
}

export function NoteEditor(props: INoteEditorProps) {
    return (
        <div className="note-editor">
            <textarea value={props.text}
                      style={{width: "100%", height: "100%", resize: "none"}}
                      onChange={(e) => props.onChange({text: e.target.value})}/>
        </div>
    );
}
