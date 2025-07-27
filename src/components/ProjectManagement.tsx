import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Github, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Upload,
  Image as ImageIcon,
  Link,
  Calendar,
  Tag,
  FolderOpen,
  Trophy
} from "lucide-react";
import ProjectPortfolio from "./ProjectPortfolio";

interface Project {
  id: string;
  title: string;
  description: string;
  github_url?: string;
  demo_url?: string;
  technologies: string[];
  images: string[];
  created_at: string;
  user_id: string;
  career_path: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  likes: number;
  views: number;
  featured: boolean;
}

interface ProjectManagementProps {
  careerPath: string;
  onClose?: () => void;
}

const ProjectManagement = ({ careerPath, onClose }: ProjectManagementProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github_url: "",
    demo_url: "",
    technologies: "",
    images: [] as string[],
    category: "web",
    difficulty: "Beginner" as 'Beginner' | 'Intermediate' | 'Advanced'
  });

  useEffect(() => {
    // Load mock data for demonstration
    loadMockProjects();
  }, [careerPath]);

  const loadMockProjects = () => {
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce platform built with React and Node.js, featuring user authentication, product catalog, shopping cart, and payment integration.',
        github_url: 'https://github.com/user/ecommerce-platform',
        demo_url: 'https://demo-ecommerce.vercel.app',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'JWT'],
        images: [
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
        ],
        created_at: '2024-01-15T00:00:00Z',
        user_id: 'mock-user',
        career_path: careerPath,
        category: 'fullstack',
        difficulty: 'Advanced',
        likes: 24,
        views: 156,
        featured: true
      },
      {
        id: '2',
        title: 'Task Management App',
        description: 'A modern task management application with drag-and-drop functionality, team collaboration features, and real-time updates.',
        github_url: 'https://github.com/user/task-manager',
        demo_url: 'https://task-manager-demo.netlify.app',
        technologies: ['React', 'TypeScript', 'Firebase', 'Material-UI'],
        images: [
          'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
        ],
        created_at: '2024-01-10T00:00:00Z',
        user_id: 'mock-user',
        career_path: careerPath,
        category: 'web',
        difficulty: 'Intermediate',
        likes: 18,
        views: 89,
        featured: false
      },
      {
        id: '3',
        title: 'Weather Mobile App',
        description: 'A beautiful weather application for mobile devices with location-based forecasts, animated weather icons, and detailed meteorological data.',
        github_url: 'https://github.com/user/weather-app',
        technologies: ['React Native', 'Expo', 'Weather API', 'Async Storage'],
        images: [
          'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop'
        ],
        created_at: '2024-01-05T00:00:00Z',
        user_id: 'mock-user',
        career_path: careerPath,
        category: 'mobile',
        difficulty: 'Beginner',
        likes: 12,
        views: 67,
        featured: false
      }
    ];
    setProjects(mockProjects);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const projectData: Project = {
        id: editingProject ? editingProject.id : Date.now().toString(),
        title: formData.title,
        description: formData.description,
        github_url: formData.github_url || undefined,
        demo_url: formData.demo_url || undefined,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        images: formData.images,
        user_id: 'mock-user',
        career_path: careerPath,
        category: formData.category,
        difficulty: formData.difficulty,
        likes: 0,
        views: 0,
        featured: false,
        created_at: new Date().toISOString()
      };

      if (editingProject) {
        setProjects(projects.map(p => p.id === editingProject.id ? projectData : p));
        console.log('Project updated successfully');
      } else {
        setProjects([projectData, ...projects]);
        console.log('Project added successfully');
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      setProjects(projects.filter(p => p.id !== projectId));
      console.log('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      github_url: project.github_url || "",
      demo_url: project.demo_url || "",
      technologies: project.technologies.join(', '),
      images: project.images,
      category: project.category,
      difficulty: project.difficulty
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      github_url: "",
      demo_url: "",
      technologies: "",
      images: [],
      category: "web",
      difficulty: "Beginner"
    });
    setEditingProject(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you'd upload to a storage service
    // For now, we'll use placeholders
    const newImages = Array.from(files).map((_, index) => 
      `https://via.placeholder.com/400x300?text=Project+Image+${index + 1}`
    );
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages].slice(0, 3) // Max 3 images
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My {careerPath} Projects</h2>
          <p className="text-muted-foreground">
            Showcase your work and track your progress
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your project"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Apps</SelectItem>
                        <SelectItem value="mobile">Mobile Apps</SelectItem>
                        <SelectItem value="api">APIs</SelectItem>
                        <SelectItem value="frontend">Frontend</SelectItem>
                        <SelectItem value="fullstack">Full Stack</SelectItem>
                        <SelectItem value="library">Libraries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="demo_url">Demo URL</Label>
                    <Input
                      id="demo_url"
                      type="url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      placeholder="https://your-demo.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="technologies">Technologies Used</Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, MongoDB (comma separated)"
                  />
                </div>

                <div>
                  <Label>Project Images (Max 3)</Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Images
                        </Button>
                      </Label>
                    </div>
                    
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Project image ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : editingProject ? 'Update' : 'Add'} Project
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="portfolio">
            <FolderOpen className="w-4 h-4 mr-2" />
            Portfolio View
          </TabsTrigger>
          <TabsTrigger value="manage">
            <Trophy className="w-4 h-4 mr-2" />
            Manage Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          <ProjectPortfolio 
            projects={projects}
            careerPath={careerPath}
            showFilters={true}
          />
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* Simple Grid View for Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="glass-card group hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Project Images */}
                  {project.images.length > 0 && (
                    <div className="relative">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-32 object-cover rounded"
                      />
                      {project.images.length > 1 && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 right-2"
                        >
                          +{project.images.length - 1}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex space-x-2">
                    {project.github_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demo_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}

            {projects.length === 0 && (
              <Card className="glass-card col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start building your portfolio by adding your first project
                  </p>
                  <Button variant="hero" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectManagement;
