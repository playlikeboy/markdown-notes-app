import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { theme } from '../../constants/theme';

interface RichEditorProps {
    initialContent?: string;
    onChange?: (content: string) => void;
}

export const RichEditor = ({ initialContent, onChange }: RichEditorProps) => {
    const editor = useEditorBridge({
        autofocus: true,
        avoidIosKeyboard: true,
        initialContent: initialContent || '',
        onChange: async () => {
            if (onChange) {
                const content = await editor.getHTML();
                onChange(content);
            }
        },
    });

    return (
        <View style={styles.container}>
            <RichText editor={editor} style={styles.editor} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <Toolbar editor={editor} />
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    editor: {
        flex: 1,
        backgroundColor: theme.colors.background,
    }
});
