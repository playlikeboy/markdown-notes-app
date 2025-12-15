import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MarkdownPreviewProps {
    content: string;
}

export const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Markdown style={markdownStyles}>
                {content}
            </Markdown>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
});

const markdownStyles = StyleSheet.create({
    body: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    heading1: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 16,
        color: '#000',
    },
    heading2: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 12,
        color: '#000',
    },
    code_block: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        fontFamily: 'Courier New', // Monospace
    },
    blockquote: {
        backgroundColor: '#f9f9f9',
        borderLeftWidth: 4,
        borderLeftColor: '#ccc',
        paddingLeft: 12,
        marginLeft: 0,
    },
});
