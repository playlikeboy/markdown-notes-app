import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface MarkdownEditorProps extends TextInputProps {
    onChangeText: (text: string) => void;
    value: string;
}

export const MarkdownEditor = ({ onChangeText, value, ...props }: MarkdownEditorProps) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                multiline
                textAlignVertical="top"
                placeholder="# Start writing..."
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="sentences"
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        padding: 16,
        color: '#333',
        fontFamily: 'System', // Use system font (San Francisco on iOS, Roboto on Android)
    },
});
