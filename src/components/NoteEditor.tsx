
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Tag, X } from "lucide-react";
import { Note } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";

interface NoteEditorProps {
  note: Note;
  onNoteUpdate: (note: Note) => void;
}

export const NoteEditor = ({ note, onNoteUpdate }: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags);
  const [newTag, setNewTag] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags);
    setHasChanges(false);
  }, [note]);

  useEffect(() => {
    const hasContentChanged = title !== note.title || content !== note.content || 
      JSON.stringify(tags) !== JSON.stringify(note.tags);
    setHasChanges(hasContentChanged);
  }, [title, content, tags, note]);

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title: title.trim() || "Untitled Note",
      content,
      tags,
      updated_at: new Date().toISOString(),
    };
    onNoteUpdate(updatedNote);
    setHasChanges(false);
    toast({
      title: "Note saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-slate-200 p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-xl font-semibold border-none shadow-none p-0 focus-visible:ring-0 bg-transparent"
          />
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a tag..."
              className="flex-1"
            />
            <Button
              onClick={addTag}
              disabled={!newTag.trim() || tags.includes(newTag.trim())}
              variant="outline"
              size="sm"
            >
              Add Tag
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="h-full border-none shadow-none resize-none focus-visible:ring-0 text-base leading-relaxed bg-transparent"
        />
      </div>
      
      {hasChanges && (
        <div className="border-t border-slate-200 p-4 bg-yellow-50/80 backdrop-blur-sm">
          <p className="text-sm text-yellow-700 flex items-center">
            <Save className="w-4 h-4 mr-2" />
            You have unsaved changes
          </p>
        </div>
      )}
    </div>
  );
};
