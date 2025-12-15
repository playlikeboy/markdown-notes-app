import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import { MarkdownPreview } from '../../components/MarkdownPreview';
import { deleteNote, getNoteById, saveNote } from '../../services/db';

export default function NoteEditorScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Debounce ref
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        loadNote();
    }, [id]);

    const loadNote = async () => {
        if (!id) return;
        try {
            const note = await getNoteById(id);
            if (note) {
                setTitle(note.title);
                setContent(note.content);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handeSave = useCallback(async (newTitle: string, newContent: string) => {
        if (!id) return;
        setIsSaving(true);
        try {
            await saveNote(id, newTitle, newContent, null, []); // Default folder/tags for now
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    }, [id]);

    const onChangeTitle = (text: string) => {
        setTitle(text);
        debouncedSave(text, content);
    };

    const onChangeContent = (text: string) => {
        setContent(text);
        debouncedSave(title, text);
    };

    const debouncedSave = (t: string, c: string) => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            handeSave(t, c);
        }, 1000); // Auto-save after 1s
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Note",
            "Are you sure you want to delete this note?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (id) await deleteNote(id);
                        router.back();
                    }
                }
            ]
        );
    };

    const toggleMode = () => {
        setMode(prev => prev === 'edit' ? 'preview' : 'edit');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: '',
                    headerRight: () => (
                        <View style={styles.headerButtons}>
                            <Text style={styles.saveStatus}>{isSaving ? 'Saving...' : ''}</Text>
                            <Pressable onPress={toggleMode} style={styles.iconButton}>
                                <Ionicons name={mode === 'edit' ? "eye-outline" : "create-outline"} size={24} color="#007AFF" />
                            </Pressable>

                            <Pressable onPress={handleDelete} style={styles.iconButton}>
                                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                            </Pressable>
                        </View>
                    ),
                }}
            />

            {mode === 'edit' ? (
                <>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Note Title"
                        value={title}
                        onChangeText={onChangeTitle}
                        maxLength={100}
                    />
                    <MarkdownEditor
                        value={content}
                        onChangeText={onChangeContent}
                    />
                </>
            ) : (
                <View style={styles.previewContainer}>
                    <Text style={styles.previewTitle}>{title}</Text>
                    <View style={styles.divider} />
                    <MarkdownPreview content={content} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        padding: 4,
    },
    saveStatus: {
        fontSize: 12,
        color: '#999',
        marginRight: 8,
    },
    titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 16,
        paddingBottom: 8,
        color: '#000',
    },
    previewContainer: {
        flex: 1,
    },
    previewTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        padding: 16,
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginHorizontal: 16,
        marginBottom: 8,
    },
});
