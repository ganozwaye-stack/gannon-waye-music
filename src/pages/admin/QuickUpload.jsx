import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, Folder, File, Trash2, 
  Image as ImageIcon, Video, Music, Plus, Grid, List, Search
} from 'lucide-react';

export default function QuickUpload() {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  
  const [files, setFiles] = useState([
    { id: 1, name: 'ThankYou_Full_Master.mp3', size: '11.4 MB', type: 'audio', folder: 'releases', date: '2026-06-05', url: '/ThankYou_Full_Master.mp3' },
    { id: 2, name: 'ThankYou_Cover_Artwork.png', size: '2.8 MB', type: 'image', folder: 'releases', date: '2026-06-05', url: '/images/thankyou_cover.png' },
    { id: 3, name: 'Gannon_Bio_Press_Kit.pdf', size: '4.5 MB', type: 'document', folder: 'press', date: '2026-06-04', url: '/docs/bio_kit.pdf' },
    { id: 4, name: 'Hoodie_Black_Front_Mockup.jpg', size: '1.2 MB', type: 'image', folder: 'merchandise', date: '2026-06-03', url: '/images/hoodie_black.jpg' },
    { id: 5, name: 'Sonia_Memorial_Tribute.jpg', size: '3.1 MB', type: 'image', folder: 'tribute', date: '2026-06-02', url: '/images/sonia_memorial.jpg' },
  ]);

  const folders = [
    { id: 'all', name: 'All Files', count: files.length },
    { id: 'releases', name: 'Releases', count: files.filter(f => f.folder === 'releases').length },
    { id: 'merchandise', name: 'Merchandise', count: files.filter(f => f.folder === 'merchandise').length },
    { id: 'tribute', name: 'Tribute Wall', count: files.filter(f => f.folder === 'tribute').length },
    { id: 'press', name: 'Press & Media', count: files.filter(f => f.folder === 'press').length },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (uploadedFiles) => {
    const newFiles = Array.from(uploadedFiles).map((file, index) => {
      const type = file.type.split('/')[0];
      return {
        id: Date.now() + index,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: type === 'audio' || type === 'image' ? type : 'document',
        folder: selectedFolder === 'all' ? 'releases' : selectedFolder,
        date: new Date().toISOString().slice(0, 10),
        url: `/uploads/${file.name}`
      };
    });

    setFiles(prev => [...newFiles, ...prev]);
    toast({
      title: "Upload Successful",
      description: `Successfully staged ${newFiles.length} file(s).`,
      variant: "default",
    });
  };

  const handleDelete = (id, name) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast({
      title: "File Removed",
      description: `${name} has been deleted from staged media library.`,
      variant: "destructive",
    });
  };

  const filteredFiles = files.filter(f => {
    const matchesFolder = selectedFolder === 'all' || f.folder === selectedFolder;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-5 h-5 text-blue-400" />;
      case 'audio': return <Music className="w-5 h-5 text-green-400" />;
      case 'video': return <Video className="w-5 h-5 text-purple-400" />;
      default: return <File className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Gannon Waye OS</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Quick Upload & Media Library</h1>
        <p className="text-muted-foreground text-sm mt-1">Staging area for all release audio, merchandise visual mockups, and digital assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders navigation */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Folders</span>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {folders.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolder(f.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-body transition-colors ${
                    selectedFolder === f.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    {f.name}
                  </span>
                  <Badge variant="outline" className="text-[10px]">{f.count}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upload zone and files display */}
        <div className="lg:col-span-3 space-y-6">
          {/* Drag & Drop Staging Area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-border/50 bg-secondary/10 hover:border-primary/50'
            }`}
          >
            <Upload className="w-10 h-10 text-primary/60 mx-auto mb-3 animate-pulse" />
            <h3 className="font-display text-lg font-bold text-foreground">Drag and drop files here</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
              Support audio files (.mp3, .wav), artwork (.png, .jpg), and campaign press packages up to 50MB.
            </p>
            <div className="mt-4">
              <input
                type="file"
                multiple
                id="file-upload-input"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <label htmlFor="file-upload-input">
                <Button variant="outline" size="sm" className="cursor-pointer gap-2">
                  <Plus className="w-3.5 h-3.5" /> Select Files to Stage
                </Button>
              </label>
            </div>
          </div>

          {/* Files List Panel */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-base font-semibold">Staged Media Assets</CardTitle>
                <CardDescription className="text-xs">Assets ready to link to products, release metadata, or web player.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search file name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 w-48 text-xs bg-secondary/30 rounded-lg border border-border/40 focus:border-primary/40 focus:outline-none"
                  />
                </div>
                {/* Layout togglers */}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
                  <Grid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-primary' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}>
                  <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-primary' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12 border border-border/20 rounded-xl bg-secondary/5">
                  <Folder className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground">No staged assets found in this folder matching your criteria.</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredFiles.map(file => (
                    <div key={file.id} className="border border-border/40 bg-secondary/20 p-3 rounded-xl flex flex-col justify-between hover:border-primary/30 transition-all group">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-card border border-border/30 shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate" title={file.name}>{file.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{file.size} · {file.date}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-2.5 border-t border-border/20">
                        <Badge variant="secondary" className="text-[8px] uppercase tracking-wider">{file.folder}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-red-400"
                          onClick={() => handleDelete(file.id, file.name)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredFiles.map(file => (
                    <div key={file.id} className="border border-border/20 bg-secondary/10 p-2.5 rounded-lg flex items-center justify-between gap-4 hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        {getFileIcon(file.type)}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate" title={file.name}>{file.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{file.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] text-muted-foreground">{file.size}</span>
                        <Badge variant="outline" className="text-[9px] uppercase">{file.folder}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-red-400"
                          onClick={() => handleDelete(file.id, file.name)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
