
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { NoteEditor } from "@/components/NoteEditor";
import { NoteList } from "@/components/NoteList";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNotes, Note } from "@/hooks/useNotes";

const Index = () => {
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleCreateNote = async () => {
    const newNote = await createNote();
    if (newNote) {
      setSelectedNote(newNote);
    }
  };

  const handleNoteUpdate = (updatedNote: Note) => {
    updateNote(updatedNote);
    setSelectedNote(updatedNote);
  };

  const handleNoteDelete = (noteId: string) => {
    deleteNote(noteId);
    
    if (selectedNote?.id === noteId) {
      const remainingNotes = notes.filter(note => note.id !== noteId);
      setSelectedNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === "" || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === null || note.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  // Set the first note as selected when notes are loaded
  if (!selectedNote && filteredNotes.length > 0 && !loading) {
    setSelectedNote(filteredNotes[0]);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your notes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <Sidebar
        tags={allTags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        onNewNote={handleCreateNote}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800">My Notes</h1>
            <div className="flex items-center gap-4">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <Button
                onClick={handleCreateNote}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex max-w-4xl mx-auto w-full">
          <div className="w-80 border-r border-slate-200 bg-white/50 backdrop-blur-sm">
            <NoteList
              notes={filteredNotes}
              selectedNote={selectedNote}
              onNoteSelect={setSelectedNote}
              onNoteDelete={handleNoteDelete}
            />
          </div>
          
          <div className="flex-1 bg-white/70 backdrop-blur-sm">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                onNoteUpdate={handleNoteUpdate}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <p className="text-lg mb-2">No note selected</p>
                  <p className="text-sm">Choose a note from the list or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
