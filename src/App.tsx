import { useEffect, useRef, useState } from 'react';
import {
  ThemeProvider,
  createMuiTheme,
  Button
} from '@material-ui/core';

import './App.css';

import { DECLARATION_WEEKLY_CHALLENGES, DECLARATION_WEEKLY_RESPONSE } from './Data';
import { getForumsList } from './API';

import Footer from './components/Footer/Footer';
import Header, { UserSettings } from './containers/Header/Header';
import RTL from './components/UI/RTL/RTL';
import Select from './components/UI/Select/Select';
import Template from './containers/Template/Template';
import SnackAlert from './components/UI/SnackAlert/SnackAlert';


const theme = createMuiTheme({
    direction: 'rtl'
});

function App() {
    const [ userSettings, setUserSettings ] = useState<UserSettings | {}>( {} );
    const [ template, setTemplate ] = useState( '' );
    const [ htmlCode, setHtmlCode ] = useState( '' );
    const [ alert, setAlert ] = useState<any>( null );
    const [ autoCompleteOptions, setAutoCompleteOptions ] = useState<any[]>( [] );
    

    const textAreaRef = useRef<any>();

    useEffect(() => {
        const list = getForumsList();
        setAutoCompleteOptions( list );

        loadUserSettings();
    }, []);

    const loadUserSettings = () => {
        const settings = JSON.parse( localStorage.getItem('userSettings') || '{}' );
        setUserSettings( settings );
    };

    const saveUserSettings = ( settings: UserSettings ) => {
        localStorage.setItem('userSettings', JSON.stringify( settings ));
        setUserSettings({ ...settings });

        popupMessage( 'נשמר בהצלחה!', 'success' );
    };

    const handleSubmission = ( htmlCode: string ) => {
        setHtmlCode( htmlCode );

        handleCopy();
    };
    
    const handleCopy = () => {
        textAreaRef.current?.select();
        document.execCommand('copy');

        popupMessage( 'התוצאה הועתקה בהצלחה(clipboard copied)', 'success' );
    };

    const handleReset = () => {
        setTemplate( '' );
        setHtmlCode( '' );
        setAlert( null );
    };

    const popupMessage = ( message: string, status: string ) => {
        setAlert({ message, status });
        setTimeout(() => setAlert( null ), 3000);
    }

    return (
        <div className = "App">
            <Header
                onSaveChanges = { saveUserSettings } 
                userSettings  = { userSettings } />

            <main className = "Main">
                <RTL>
                <ThemeProvider theme = { theme }>
                    {(  template === DECLARATION_WEEKLY_CHALLENGES ||
                        template === DECLARATION_WEEKLY_RESPONSE ) &&
                    <div className = "WeeklyChallengesMessage">
                        <p style={{ textAlign: 'center', margin: 0 }}> ⓘ </p>
                        להזכירכם, בעת ההכרזה עליכם:
                        <ol>
                        <li>לבטל את הצגת החתימה בתגובה</li>
                        <li>למחוק את ההכרזה של השבוע הקודם</li>
                        <li>ליידע את מפקח הקטגורייה באשכול הדיון</li>
                        </ol>
                    </div>}

                    <div className = "TemplateContainer">
                        <Select
                            template = { template }
                            onSelect = { value => setTemplate( value) } />
                        {template && <Template
                            userSettings        = { userSettings }
                            autoCompleteOptions = { autoCompleteOptions }
                            template            = { template }
                            onSubmit            = { handleSubmission }
                            onReset             = { handleReset } />}
                    </div>

                    {htmlCode && <div className = "HtmlTemplate">
                        <Button
                            type    = "button"
                            color   = "inherit"
                            variant = "outlined"
                            onClick = { handleCopy }
                            fullWidth > העתק </Button>
                        <textarea
                            readOnly
                            ref   = { textAreaRef }
                            value = { htmlCode }
                            style = {{
                                maxWidth: '100%',
                                minWidth: '100%',
                                minHeight: 500,
                                width: '100%',
                                height: 500
                            }}></textarea>
                    </div>}
                </ThemeProvider>
                </RTL>
            </main>

            {alert && <SnackAlert
                isOpen  = { alert !== null }
                message = { alert.message }
                status  = { alert.status }
                onClose = { () => setAlert( null ) } />}
            <Footer />
        </div>
    );
}

export default App;
