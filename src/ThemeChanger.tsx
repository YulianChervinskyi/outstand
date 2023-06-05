import {darkTheme, lightTheme} from "./icons/images";
import "./ThemeChanger.scss";

interface IThemeChanger {
    onChangeTheme: () => void,
    lightTheme: boolean,
}

export function ThemeChanger(props: IThemeChanger) {
    return <img className="theme-changer"
                src={props.lightTheme ? lightTheme : darkTheme}
                onClick={() => props.onChangeTheme()}
                alt="theme"/>;
}