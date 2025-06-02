
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all notes from Supabase
  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new note
  const createNote = async () => {
    try {
      const newNote = {
        title: 'Untitled Note',
        content: '',
        tags: [],
      };

      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select()
        .single();

      if (error) throw error;

      setNotes([data, ...notes]);
      toast({
        title: "New note created",
        description: "Start writing your thoughts!",
      });

      return data;
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update a note
  const updateNote = async (updatedNote: Note) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: updatedNote.title,
          content: updatedNote.content,
          tags: updatedNote.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedNote.id);

      if (error) throw error;

      setNotes(notes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    }
  };

  // Delete a note
  const deleteNote = async (noteId: string) => {
    try {
      const noteToDelete = notes.find(note => note.id === noteId);
      
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== noteId));
      
      toast({
        title: "Note deleted",
        description: `"${noteToDelete?.title}" has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  };
};
