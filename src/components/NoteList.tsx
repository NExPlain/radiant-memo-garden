
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar } from "lucide-react";
import { Note } from "@/hooks/useNotes";

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (noteId: string) => void;
}

export const NoteList = ({ notes, selectedNote, onNoteSelect, onNoteDelete }: NoteListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-700">
          {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
        </h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`group p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedNote?.id === note.id
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => onNoteSelect(note)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-slate-800 truncate flex-1 mr-2">
                  {note.title}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteDelete(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                {note.content || "No content"}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{note.tags.length - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-slate-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(note.updated_at)}
                </div>
              </div>
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No notes found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or tags</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
