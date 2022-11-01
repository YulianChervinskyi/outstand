export interface INoteEditorProps {
    width: number,
    height: number,
    text: string,
    onChange: (e: { text: string }) => void,
}

export function NoteEditor(props: INoteEditorProps) {
    return (
        <div className="note-editor">
            <textarea value={props.text}
                      style={{width: props.width, height: "100%"}}
                      onChange={(e) => props.onChange({text: e.target.value})}/>
        </div>
    );
}
