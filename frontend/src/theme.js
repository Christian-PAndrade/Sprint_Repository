import { createMuiTheme } from "@material-ui/core/styles";
export default createMuiTheme({
  typography: {
    useNextVariants: true
  },
"palette":{
    "common":{
        "black":"#000",
        "white":"#fff"
    },
    "background":{
        "paper":"rgba(74, 144, 226, 1)",
        "default":"#fafafa"},
        "primary":{
            "light":"rgba(31, 122, 140, 1)",
            "main":"rgba(45, 48, 71, 1)",
            "dark":"rgba(38, 65, 60, 1)",
            "contrastText":"#fff"},
            "secondary":{
                "light":"rgba(155, 197, 61, 1)",
                "main":"rgba(12, 71, 103, 1)",
                "dark":"rgba(38, 65, 60, 1)",
                "contrastText":"#fff"},
                "error":{
                    "light":"rgba(31, 122, 140, 1)",
                    "main":"rgba(155, 197, 61, 1)",
                    "dark":"rgba(45, 48, 71, 1)",
                    "contrastText":"#fff"},
                    "text":{
                        "primary":"rgba(0, 0, 0, 0.87)",
                        "secondary":"rgba(0, 0, 0, 0.54)",
                        "disabled":"rgba(0, 0, 0, 0.38)",
                        "hint":"rgba(0, 0, 0, 0.38)"
                    }
                }
});

