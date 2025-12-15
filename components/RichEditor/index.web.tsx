import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { theme } from '../../constants/theme';

interface RichEditorProps {
    initialContent?: string;
    onChange?: (content: string) => void;
}

export const RichEditor = ({ initialContent, onChange }: RichEditorProps) => {
    // Basic Web Fallback: Just a text area for now to prevent crashing
    // Future: Upgrade to react-quill or tiptap-web

    // Strip HTML for the text input display (rough approximation)
    const initialText = initialContent?.replace(/<[^>]+>/g, '') || '';

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                multiline
                defaultValue={initialText} // Simple uncontrolled for now
                onChangeText={onChange} // Pass raw text back. Note: This breaks HTML structure if saving back, but unblocks the crash.
                placeholder="Start writing..."
                placeholderTextColor={theme.colors.textSecondary}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'System',
        // @ts-ignore: Web-only style
        outlineStyle: 'none',
        textAlignVertical: 'top',
        color: theme.colors.text,
    }
});
