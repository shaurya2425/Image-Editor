import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Upload, Lock, Unlock, Download, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

function SteganographyModal({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState('hide-text');
  const [secretText, setSecretText] = useState('');
  const [password, setPassword] = useState('');
  const [extractedData, setExtractedData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEncode = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Image encoded successfully! Download will start.');
    }, 2000);
  };

  const handleDecode = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setExtractedData('This is a secret message that was hidden in the image!');
      setIsProcessing(false);
    }, 2000);
  };

  const neonButtonStyles = {
    background: 'linear-gradient(to right, var(--editor-neon-blue), var(--editor-neon-cyan))',
    color: 'var(--editor-text)',
    transition: 'all 0.2s ease',
  };

  const handleMouseInteraction = (event, type) => {
    if (isProcessing) return;
    if (type === 'enter') {
      event.currentTarget.style.opacity = '0.9';
    } else if (type === 'leave') {
      event.currentTarget.style.opacity = '1';
      event.currentTarget.style.transform = 'scale(1)';
      event.currentTarget.style.filter = 'brightness(1)';
    } else if (type === 'down') {
      event.currentTarget.style.transform = 'scale(0.97)';
      event.currentTarget.style.filter = 'brightness(1.15)';
    } else if (type === 'up') {
      event.currentTarget.style.transform = 'scale(1)';
      event.currentTarget.style.filter = 'brightness(1)';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel max-w-2xl border border-[rgba(31,111,235,0.2)] bg-editor-panel text-editor-text">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-editor-text">
            <Lock className="w-5 h-5 text-editor-neon-cyan" />
            Steganography Tools
          </DialogTitle>
          <DialogDescription className="text-editor-text-muted">
            Hide or extract secret data from images using steganography
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[rgba(31,111,235,0.1)]">
            <TabsTrigger 
              value="hide-text" 
              className="text-[var(--editor-text-muted)] data-[state=active]:bg-editor-neon-blue data-[state=active]:text-[var(--editor-text)]"
            >
              Hide Text
            </TabsTrigger>
            <TabsTrigger 
              value="hide-image" 
              className="text-[var(--editor-text-muted)] data-[state=active]:bg-editor-neon-blue data-[state=active]:text-[var(--editor-text)]"
            >
              Hide Image
            </TabsTrigger>
            <TabsTrigger 
              value="extract" 
              className="text-[var(--editor-text-muted)] data-[state=active]:bg-editor-neon-blue data-[state=active]:text-[var(--editor-text)]"
            >
              Extract Data
            </TabsTrigger>
          </TabsList>

          {/* Hide Text */}
          <TabsContent value="hide-text" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Label className="block text-editor-text-muted">Secret Message</Label>
              <Textarea
                value={secretText}
                onChange={(e) => setSecretText(e.target.value)}
                placeholder="Enter your secret message..."
                className="min-h-32 bg-[rgba(31,111,235,0.1)] border border-[rgba(31,111,235,0.3)] text-editor-text placeholder:text-editor-text-muted"
              />

              <Label className="block text-editor-text-muted">Password (Optional)</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter encryption password..."
                className="pl-10 bg-[rgba(31,111,235,0.1)] border border-[rgba(31,111,235,0.3)] text-editor-text placeholder:text-editor-text-muted"
              />

              <Button
                disabled={isProcessing}
                className="w-full neon-glow-cyan gap-2"
                style={neonButtonStyles}
                onMouseEnter={(e) => handleMouseInteraction(e, 'enter')}
                onMouseLeave={(e) => handleMouseInteraction(e, 'leave')}
                onMouseDown={(e) => handleMouseInteraction(e, 'down')}
                onMouseUp={(e) => handleMouseInteraction(e, 'up')}
              >
                <Download className="w-4 h-4" />
                {isProcessing ? 'Encoding...' : 'Encode & Download'}
              </Button>
            </motion.div>
          </TabsContent>

          {/* Hide Image */}
          <TabsContent value="hide-image" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Label className="block text-editor-text-muted">Cover Image</Label>
              <div className="border-2 border-dashed border-[rgba(31,111,235,0.3)] rounded-lg p-6 text-center cursor-pointer hover:border-editor-neon-cyan">
                <Upload className="w-8 h-8 text-editor-neon-blue mx-auto mb-2" />
                <p className="text-editor-text">Click to upload cover image</p>
                <p className="text-editor-text-muted">The image that will contain the secret</p>
              </div>

              <Label className="block text-editor-text-muted">Secret Image</Label>
              <div className="border-2 border-dashed border-[rgba(31,111,235,0.3)] rounded-lg p-6 text-center cursor-pointer hover:border-editor-neon-cyan">
                <ImageIcon className="w-8 h-8 text-editor-neon-blue mx-auto mb-2" />
                <p className="text-editor-text">Click to upload secret image</p>
                <p className="text-editor-text-muted">The image to hide</p>
              </div>

              <Button
                disabled={isProcessing}
                className="w-full neon-glow-cyan gap-2"
                style={neonButtonStyles}
                onMouseEnter={(e) => handleMouseInteraction(e, 'enter')}
                onMouseLeave={(e) => handleMouseInteraction(e, 'leave')}
                onMouseDown={(e) => handleMouseInteraction(e, 'down')}
                onMouseUp={(e) => handleMouseInteraction(e, 'up')}
              >
                <Download className="w-4 h-4" />
                {isProcessing ? 'Encoding...' : 'Encode & Download'}
              </Button>
            </motion.div>
          </TabsContent>

          {/* Extract */}
          <TabsContent value="extract" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Label className="block text-editor-text-muted">Upload Encoded Image</Label>
              <div className="border-2 border-dashed border-[rgba(31,111,235,0.3)] rounded-lg p-6 text-center cursor-pointer hover:border-editor-neon-cyan">
                <Upload className="w-8 h-8 text-editor-neon-blue mx-auto mb-2" />
                <p className="text-editor-text">Click to upload encoded image</p>
                <p className="text-editor-text-muted">Image containing hidden data</p>
              </div>

              <Button
                disabled={isProcessing}
                className="w-full neon-glow-cyan gap-2"
                style={neonButtonStyles}
                onMouseEnter={(e) => handleMouseInteraction(e, 'enter')}
                onMouseLeave={(e) => handleMouseInteraction(e, 'leave')}
                onMouseDown={(e) => handleMouseInteraction(e, 'down')}
                onMouseUp={(e) => handleMouseInteraction(e, 'up')}
              >
                <Unlock className="w-4 h-4" />
                {isProcessing ? 'Decoding...' : 'Decode & Extract'}
              </Button>

              {extractedData && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-lg border border-[rgba(31,111,235,0.3)] bg-[rgba(31,111,235,0.1)]">
                  <Label className="block text-editor-neon-cyan mb-2">Extracted Message:</Label>
                  <p className="text-editor-text p-3 rounded bg-[rgba(0,0,0,0.3)]">{extractedData}</p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default SteganographyModal;
