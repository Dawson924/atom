import { ChangeEvent, useEffect, useState } from 'react';
import { Card, Container, Form, FormInput } from '../../components/commons';

export default function StartupPage() {
    const [javaPath, setJavaPath] = useState<string>('');
    const [jvmArgs, setJvmArgs] = useState<string>('');
    const [mcArgs, setMcArgs] = useState<string>('');

    useEffect(() => {
        window.config.get('launch.javaPath').then(setJavaPath);
        window.config.get('launch.extraArguments.jvm').then(setJvmArgs);
        window.config.get('launch.extraArguments.mc').then(setMcArgs);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        window.config.set(`launch.${e.target.name}`, value);
    };

    return (
        <Container>
            <Card title="Launch">
                <Form>
                    <FormInput
                        title="Java Path"
                        name="javaPath"
                        value={javaPath}
                        onChange={handleChange}
                    />
                    <FormInput
                        title="JVM Arguments"
                        name="extraArguments.jvm"
                        value={jvmArgs}
                        onChange={handleChange}
                    />
                    <FormInput
                        title="MC Arguments"
                        name="extraArguments.mc"
                        value={mcArgs}
                        onChange={handleChange}
                    />
                </Form>
            </Card>
        </Container>
    );
}
