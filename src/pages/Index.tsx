
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { NoteEditor } from "@/components/NoteEditor";
import { NoteList } from "@/components/NoteList";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Welcome to Your Notes",
      content: "This is your personal note management system. Start by creating your first note!",
      tags: ["welcome", "getting-started"],
      createdAt: new Date("2024-06-01"),
      updatedAt: new Date("2024-06-01"),
    },
    {
      id: "2",
      title: "Meeting Notes",
      content: "Discussion points:\n- Project timeline\n- Budget allocation\n- Team responsibilities",
      tags: ["work", "meetings"],
      createdAt: new Date("2024-06-02"),
      updatedAt: new Date("2024-06-02"),
    },
  ]);
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { toast } = useToast();

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    toast({
      title: "New note created",
      description: "Start writing your thoughts!",
    });
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date() }
        : note
    ));
    setSelectedNote(updatedNote);
  };

  const deleteNote = (noteId: string) => {
    const noteToDelete = notes.find(note => note.id === noteId);
    setNotes(notes.filter(note => note.id !== noteId));
    
    if (selectedNote?.id === noteId) {
      const remainingNotes = notes.filter(note => note.id !== noteId);
      setSelectedNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
    }
    
    toast({
      title: "Note deleted",
      description: `"${noteToDelete?.title}" has been removed.`,
    });
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === "" || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === null || note.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <Sidebar
        tags={allTags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        onNewNote={createNewNote}
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
                onClick={createNewNote}
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
              onNoteDelete={deleteNote}
            />
          </div>
          
          <div className="flex-1 bg-white/70 backdrop-blur-sm">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                onNoteUpdate={updateNote}
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
