import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
}

const AvatarUpload = ({ userId, currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      
      // TODO: Implement file upload to backend server
      // For now, simulate successful upload
      const mockAvatarUrl = URL.createObjectURL(file);

      onAvatarUpdate(mockAvatarUrl);
      toast.success('Avatar updated successfully!');
    } catch (error: any) {
      toast.error('Error uploading avatar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Profile Photo</span>
        </CardTitle>
        <CardDescription>
          Upload a profile photo to personalize your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={currentAvatarUrl} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-white">
              <Camera className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button asChild disabled={uploading} variant="outline">
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </>
                  )}
                </span>
              </Button>
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarUpload;