import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../App';
import { Card, Container, Form, FormSelect } from '../../components/commons';

export default function AppearancePage() {
    const { setThemeMode, fetch } = useContext(ThemeContext);

    const [theme, setTheme] = useState<string>();

    useEffect(() => {
        window.config.get('appearance.theme').then(setTheme);
    }, []);

    if (!theme || !setThemeMode || !fetch) return null;

    return (
        <Container>
            <Card title="appearance">
                <Form>
                    <FormSelect
                        title="Theme"
                        value={theme}
                        onChange={(e) => {
                            window.config.set('appearance.theme', e.target.value);
                            setTheme(e.target.value);
                            setThemeMode(e.target.value);
                            fetch();
                        }}
                        options={[
                            { value: 'light', label: 'Light' },
                            { value: 'dark', label: 'Dark' }
                        ]}
                    />
                </Form>
            </Card>
        </Container>
    );
}
