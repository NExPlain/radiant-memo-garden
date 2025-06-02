
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Tag, Home } from "lucide-react";

interface SidebarProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  onNewNote: () => void;
}

export const Sidebar = ({ tags, selectedTag, onTagSelect, onNewNote }: SidebarProps) => {
  return (
    <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Notes</h2>
        <Button
          onClick={onNewNote}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <Home className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Quick Access</span>
        </div>
        <Button
          variant={selectedTag === null ? "default" : "ghost"}
          onClick={() => onTagSelect(null)}
          className="w-full justify-start"
        >
          All Notes
        </Button>
      </div>

      <div className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Tags</span>
        </div>
        
        <ScrollArea className="h-48">
          <div className="space-y-1">
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "ghost"}
                onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
                className="w-full justify-start text-left"
              >
                <Badge variant="secondary" className="mr-2 text-xs">
                  {tag}
                </Badge>
              </Button>
            ))}
            {tags.length === 0 && (
              <p className="text-sm text-slate-500 italic">No tags yet</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
