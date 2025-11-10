import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Upload, Lock, Unlock, Download, Image as ImageIcon, AlertCircle, CheckCircle, Loader2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const BASE_URL = 'https://image-editor-1ya8.onrender.com';

function SteganographyModal({ open, onOpenChange }) {
    const [activeTab, setActiveTab] = useState('hide-text');
    const [secretText, setSecretText] = useState('');
    const [carrierFile, setCarrierFile] = useState(null);
    const [secretFile, setSecretFile] = useState(null);
    const [encodedFile, setEncodedFile] = useState(null);
    const [extractedData, setExtractedData] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [capacityInfo, setCapacityInfo] = useState(null);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleFileSelect = (e, setter) => {
        const file = e.target.files[0];
        if (file) {
            setter(file);
            setMessage({ type: '', text: '' });
        }
    };

    const checkCapacity = async () => {
        if (!carrierFile || !secretFile) {
            showMessage('error', 'Please upload both carrier and secret images');
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('carrier_image', carrierFile);
        formData.append('secret_image', secretFile);

        try {
            const response = await fetch(`${BASE_URL}/image/check-capacity`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setCapacityInfo(data);
                if (data.can_encode) {
                    showMessage('success', `Encoding possible! ${data.analysis.usage_percent}% capacity used`);
                } else {
                    showMessage('error', data.analysis.recommendation);
                }
            } else {
                showMessage('error', data.detail || 'Failed to check capacity');
            }
        } catch (error) {
            showMessage('error', 'Network error: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const encodeText = async () => {
        if (!carrierFile) {
            showMessage('error', 'Please upload a carrier image');
            return;
        }
        if (!secretText.trim()) {
            showMessage('error', 'Please enter text to hide');
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('carrier_image', carrierFile);

        const textBlob = new Blob([secretText], { type: 'text/plain' });
        formData.append('secret_file', textBlob, 'secret.txt');

        try {
            const response = await fetch(`${BASE_URL}/text/encode`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `encoded_${carrierFile.name.split('.')[0]}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                showMessage('success', 'Text encoded successfully! Download started.');
            } else {
                const data = await response.json();
                showMessage('error', data.detail || 'Encoding failed');
            }
        } catch (error) {
            showMessage('error', 'Network error: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const encodeImage = async () => {
        if (!carrierFile || !secretFile) {
            showMessage('error', 'Please upload both carrier and secret images');
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('carrier_image', carrierFile);
        formData.append('secret_image', secretFile);

        try {
            const response = await fetch(`${BASE_URL}/image/encode-image`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `steg_${carrierFile.name.split('.')[0]}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                showMessage('success', 'Image encoded successfully! Download started.');
            } else {
                const data = await response.json();
                showMessage('error', data.detail || 'Encoding failed');
            }
        } catch (error) {
            showMessage('error', 'Network error: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const decodeImage = async () => {
        if (!encodedFile) {
            showMessage('error', 'Please upload an encoded image');
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('steg_image', encodedFile);

        try {
            const response = await fetch(`${BASE_URL}/text/decode`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('text')) {
                    const text = await response.text();
                    setExtractedData(text);
                    showMessage('success', 'Text extracted successfully!');
                } else {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'extracted_file';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    setExtractedData('File extracted and downloaded successfully!');
                    showMessage('success', 'File extracted! Download started.');
                }
            } else {
                const data = await response.json();
                showMessage('error', data.detail || 'Decoding failed');
            }
        } catch (error) {
            showMessage('error', 'Network error: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
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

                {/* Message Alert */}
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mx-6 p-3 rounded-lg flex items-center gap-2 ${
                            message.type === 'success'
                                ? 'bg-[rgba(34,197,94,0.1)] text-green-400 border border-[rgba(34,197,94,0.3)]'
                                : 'bg-[rgba(239,68,68,0.1)] text-red-400 border border-[rgba(239,68,68,0.3)]'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="text-sm">{message.text}</span>
                    </motion.div>
                )}

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
                            <div>
                                <Label className="block text-editor-text-muted mb-2">Carrier Image</Label>
                                <label className="block cursor-pointer">
                                    <div className="border-2 border-dashed border-[rgba(31,111,235,0.3)] rounded-lg p-6 text-center hover:border-editor-neon-cyan transition-colors">
                                        <Upload className="w-8 h-8 text-editor-neon-blue mx-auto mb-2" />
                                        <p className="text-editor-text">{carrierFile ? carrierFile.name : 'Click to upload carrier image'}</p>
                                        <p className="text-editor-text-muted text-sm">The image that will contain the secret</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e, setCarrierFile)}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div>
                                <Label className="block text-editor-text-muted mb-2">Secret Message</Label>
                                <Textarea
                                    value={secretText}
                                    onChange={(e) => setSecretText(e.target.value)}
                                    placeholder="Enter your secret message..."
                                    className="min-h-32 bg-[rgba(31,111,235,0.1)] border border-[rgba(31,111,235,0.3)] text-editor-text placeholder:text-editor-text-muted"
                                />
                            </div>

                            <Button
                                onClick={encodeText}
                                disabled={isProcessing}
                                className="w-full neon-glow-cyan gap-2"
                                style={neonButtonStyles}
                                onMouseEnter={(e) => handleMouseInteraction(e, 'enter')}
                                onMouseLeave={(e) => handleMouseInteraction(e, 'leave')}
                                onMouseDown={(e) => handleMouseInteraction(e, 'down')}
                                onMouseUp={(e) => handleMouseInteraction(e, 'up')}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Encoding...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Encode & Download
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </TabsContent>

                    {/* Hide Image */}
                    <TabsContent value="hide-image" className="space-y-4">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <div>
                                <Label className="block text-editor-text-muted mb-2">Cover Image</Label>
                                <label className="block cursor-pointer">
                                    <div className="border-2 border-dashed border-[rgba(31,111,235,0.3)] rounded-lg p-6 text-center hover:border-editor-neon-cyan transition-colors">
                                        <Upload className="w-8 h-8 text-editor-neon-blue mx-auto mb-2" />
                                        <p className="text-editor-text">{carrierFile ? carrierFile.name : 'Click to upload cover image'}</p>
                                        <p className="text-editor-text-muted text-sm">The image that will contain the secret</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e, setCarrierFile)}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div>
                                <Label className="block text-editor-text-muted mb-2">Secret Image</Label>
                                <label className="block cursor-pointer">
                                    <div className="border-2 border-dashed border-[rgba(31,111,235,0.3)] rounded-lg p-6 text-center hover:border-editor-neon-cyan transition-colors">
                                        <ImageIcon className="w-8 h-8 text-editor-neon-blue mx-auto mb-2" />
                                        <p className="text-editor-text">{secretFile ? secretFile.name : 'Click to upload secret image'}</p>
                                        <p className="text-editor-text-muted text-sm">The image to hide</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e, setSecretFile)}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {capacityInfo && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-4 rounded-lg border ${
                                        capacityInfo.can_encode
                                            ? 'bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)]'
                                            : 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)]'
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <Info className="w-5 h-5 text-editor-neon-cyan mt-0.5" />
                                        <div className="text-sm text-editor-text-muted">
                                            <p className="font-medium mb-1 text-editor-text">Capacity Analysis:</p>
                                            <p>Carrier: {capacityInfo.carrier_info.dimensions} ({capacityInfo.carrier_info.capacity_mb} MB capacity)</p>
                                            <p>Secret: {capacityInfo.secret_info.dimensions} ({capacityInfo.secret_info.size_kb} KB)</p>
                                            <p className="mt-1 font-medium text-editor-text">{capacityInfo.analysis.recommendation}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={checkCapacity}
                                    disabled={isProcessing}
                                    className="flex-1 bg-[rgba(31,111,235,0.2)] hover:bg-[rgba(31,111,235,0.3)] text-editor-text gap-2"
                                    onMouseEnter={(e) => handleMouseInteraction(e, 'enter')}
                                    onMouseLeave={(e) => handleMouseInteraction(e, 'leave')}
                                    onMouseDown={(e) => handleMouseInteraction(e, 'down')}
                                    onMouseUp={(e) => handleMouseInteraction(e, 'up')}
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Info className="w-4 h-4" />}
                                    Check Capacity
                                </Button>
                                <Button
                                    onClick={encodeImage}
                                    disabled={isProcessing}
                                    className="flex-1 neon-glow-cyan gap-2"
                                    style={neonButtonStyles}
                                    onMouseEnter={(e) => handleMouseInteraction(e, 'enter')}
                                    onMouseLeave={(e) => handleMouseInteraction(e, 'leave')}
                                    onMouseDown={(e) => handleMouseInteraction(e, 'down')}
                                    onMouseUp={(e) => handleMouseInteraction(e, 'up')}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Encoding...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            Encode & Download
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* Extract */}
                    <TabsContent value="extract" className="space-y-4">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <div>
                                <Label className="block text-editor-text-muted mb-2">Upload Encoded Image</Label>
                                <label className="block cursor-pointer">
                                    <div className="border-2 border-dashed border-[rgba(31,111,235,0.3)] rounded-lg p-6 text-center hover:border-editor-neon-cyan transition-colors">
                                        <Upload className="w-8 h-8 text-editor-neon-blue mx-auto mb-2" />
                                        <p className="text-editor-text">{encodedFile ? encodedFile.name : 'Click to upload encoded image'}</p>
                                        <p className="text-editor-text-muted text-sm">Image containing hidden data</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e, setEncodedFile)}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <Button
                                onClick={decodeImage}
                                disabled={isProcessing}
                                className="w-full neon-glow-cyan gap-2"
                                style={neonButtonStyles}
                                onMouseEnter={(e) => handleMouseInteraction(e, 'enter')}
                                onMouseLeave={(e) => handleMouseInteraction(e, 'leave')}
                                onMouseDown={(e) => handleMouseInteraction(e, 'down')}
                                onMouseUp={(e) => handleMouseInteraction(e, 'up')}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Decoding...
                                    </>
                                ) : (
                                    <>
                                        <Unlock className="w-4 h-4" />
                                        Decode & Extract
                                    </>
                                )}
                            </Button>

                            {extractedData && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-lg border border-[rgba(31,111,235,0.3)] bg-[rgba(31,111,235,0.1)]">
                                    <Label className="block text-editor-neon-cyan mb-2">Extracted Message:</Label>
                                    <p className="text-editor-text p-3 rounded bg-[rgba(0,0,0,0.3)] whitespace-pre-wrap break-words">{extractedData}</p>
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