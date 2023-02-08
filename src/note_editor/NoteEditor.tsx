import {IComponentProps} from "../Box";
import "./NoteEditor.scss";

export function NoteEditor(props: IComponentProps) {
    return (
        <div className="note-editor">
            <textarea value={props.text}
                      style={{width: "100%", height: "100%", resize: "none"}}
                      onChange={(e) => props.onChange({text: e.target.value})}/>
        </div>
    );
}
