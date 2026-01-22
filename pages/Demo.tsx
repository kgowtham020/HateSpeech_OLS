import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, CheckCircle, Info, Loader2, Mic, Square, Trash2, Volume2, Lock, MessageSquare, RotateCcw } from 'lucide-react';
import { analyzeText } from '../services/geminiService';
import { PredictionResult, ClassLabel } from '../types';

// Add SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Demo: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [mimeType, setMimeType] = useState<string>('audio/webm');
  
  // Permission Retry State
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionErrorDetails, setPermissionErrorDetails] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null); // For Speech Recognition
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const shouldAnalyzeRef = useRef(false); // Flag to handle stop-and-analyze flow

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore error if already stopped
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Visualizer function
  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!isRecording && !analyser) return; // Stop if not recording
      
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        // Gradient color based on height
        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;

        canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4', // Safari 14.1+
      'audio/ogg',
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return ''; // Let browser decide default
  };

  const handlePermissionError = (err: any) => {
      console.error("Error accessing microphone:", err);
      let msg = "Could not access microphone.";
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          msg = "Permission denied. Please click the Lock icon in your address bar and allow Microphone access.";
      } else if (err.name === 'NotFoundError') {
          msg = "No microphone found. Please check your device connections.";
      } else if (err.name === 'NotReadableError') {
          msg = "Microphone is busy. Is another application using it?";
      } else if (err.name === 'SecurityError' || (err.message && err.message.includes('Secure'))) {
          msg = "Security Error: HTTPS is required for microphone access. Please use localhost or a secure HTTPS connection.";
      } else {
          msg = `Microphone Error: ${err.message || "Unknown error"}`;
      }

      setPermissionErrorDetails(msg);
      setShowPermissionModal(true);
      setIsRecording(false);
  };

  const startRecording = async () => {
    setError(null);
    setResult(null);
    setInputText(''); 
    shouldAnalyzeRef.current = false;
    cleanupAudio(); // Ensure clean state
    setShowPermissionModal(false); // Reset modal if retrying
    
    // 1. Browser & Security Checks
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Safe check for isSecureContext to avoid TS build errors if property is missing in definition
        const isSecure = (window as any).isSecureContext;
        if (isSecure === false) {
           handlePermissionError({ name: 'SecurityError', message: 'Insecure Context' });
        } else {
           handlePermissionError({ name: 'NotFoundError', message: 'Browser API not supported' });
        }
        return;
    }

    try {
      // --- Start Audio Stream for Visualizer & MediaRecorder ---
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // If we got here, permission was granted!
      setShowPermissionModal(false);

      // Setup Visualizer
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
            // Resume if suspended (browser policy)
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
            
            analyserRef.current = audioContextRef.current.createAnalyser();
            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.fftSize = 256;
            drawVisualizer();
        }
      } catch (audioCtxError) {
        console.warn("Visualizer setup failed (non-critical):", audioCtxError);
      }

      // Setup Media Recorder (For Blob)
      const options = { mimeType: getSupportedMimeType() };
      const recorderOptions = options.mimeType ? { mimeType: options.mimeType } : undefined;
      
      mediaRecorderRef.current = new MediaRecorder(stream, recorderOptions);
        
      setMimeType(mediaRecorderRef.current.mimeType);
      
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const actualMimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: actualMimeType });
        setAudioBlob(blob);
        setMimeType(actualMimeType);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Cleanup stream tracks immediately to stop red dot
        stream.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        
        // Handle immediate analysis if requested
        if (shouldAnalyzeRef.current) {
            shouldAnalyzeRef.current = false;
            handlePredict(true, blob);
        }
      };

      mediaRecorderRef.current.start();

      // --- Start Web Speech API for Immediate Text Extraction ---
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          // Flatten results to a single string
          const currentTranscript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
            
          setInputText(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.warn("Speech recognition warning:", event.error);
        };
        
        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error("Speech Recognition failed to start:", e);
        }
      }

      setIsRecording(true);
      setRecordingDuration(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
       handlePermissionError(err);
    }
  };

  const stopAndAnalyze = () => {
    // 1. Stop Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }

    // 2. Stop Recorder -> Triggers onstop -> Triggers handlePredict
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      shouldAnalyzeRef.current = true; // Set flag
      setLoading(true); // Show loading immediately
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingDuration(0);
    setResult(null);
    setInputText('');
    setLoading(false);
    setError(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Handle both data:URL formats and raw base64 if necessary
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Optional directBlob parameter allows calling this immediately after stop() 
  // without waiting for React state update for audioBlob
  const handlePredict = async (isAuto = false, directBlob?: Blob) => {
    const blobToUse = directBlob || audioBlob;
    
    // Fallback: If no text and no audio, do nothing
    // We check chunksRef as a last resort if state hasn't updated yet in manual clicks
    const hasChunks = chunksRef.current.length > 0;
    
    if (!inputText.trim() && !blobToUse && !hasChunks) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    if (!isAuto) setResult(null);

    try {
      let audioData = undefined;
      
      // Construct blob if needed
      let finalBlob = blobToUse;
      if (!finalBlob && hasChunks) {
         finalBlob = new Blob(chunksRef.current, { type: mimeType });
      }

      if (finalBlob) {
        const base64 = await blobToBase64(finalBlob);
        audioData = {
          data: base64,
          mimeType: finalBlob.type || mimeType
        };
      }

      // We send both InputText (from Web Speech) and Audio.
      const prediction = await analyzeText(inputText, audioData);
      
      setResult(prediction);
      
      // Update text with the refined transcription from the model if available
      if (prediction.transcription && prediction.transcription.length > 0) {
          setInputText(prediction.transcription);
      }

    } catch (err: any) {
      console.error("Caught error in Demo:", err);
      const errorMessage = err.message || "Unknown error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (label: ClassLabel) => {
    switch (label) {
      case ClassLabel.HATE_SPEECH: return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200';
      case ClassLabel.OFFENSIVE_LANGUAGE: return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200';
      case ClassLabel.NORMAL: return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200';
      default: return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const getResultIcon = (label: ClassLabel) => {
    switch (label) {
      case ClassLabel.HATE_SPEECH: return <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />;
      case ClassLabel.OFFENSIVE_LANGUAGE: return <Info className="h-6 w-6 text-amber-600 dark:text-amber-400" />;
      case ClassLabel.NORMAL: return <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Live Multimodal Demo</h2>
        <p className="text-slate-500 mt-2">Speak naturally or type text to test the OLS classifier.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        
        {/* Mode Selector / Input Area */}
        <div className="p-6 space-y-6">
          
          {/* Audio Input Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Voice Input (Live)
                </label>
                {isRecording && <span className="flex items-center text-xs text-red-500 animate-pulse font-bold"><div className="h-2 w-2 bg-red-500 rounded-full mr-1"></div> RECORDING</span>}
            </div>
            
            <div className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors overflow-hidden min-h-[250px] ${isRecording ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
              
              {/* Visualizer Canvas overlay */}
              <canvas 
                ref={canvasRef} 
                width="600" 
                height="100" 
                className={`absolute bottom-0 left-0 w-full h-full opacity-20 pointer-events-none ${isRecording ? 'block' : 'hidden'}`}
              />
              
              {/* Permission Modal / Blocking Overlay */}
              {showPermissionModal && (
                <div className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                    <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
                        <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Microphone Access Needed</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-sm">
                        {permissionErrorDetails}
                    </p>
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button 
                            onClick={startRecording}
                            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition-transform active:scale-95"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Retry Permission
                        </button>
                        <p className="text-xs text-slate-400 mt-2">
                            1. Click the Lock icon in your browser URL bar.<br/>
                            2. Toggle Microphone to "Allow".<br/>
                            3. Click "Retry Permission" above.
                        </p>
                    </div>
                </div>
              )}

              {!audioBlob && !isRecording && !showPermissionModal && (
                <button 
                  onClick={startRecording}
                  className={`flex flex-col items-center group w-full py-4 z-10`}
                >
                  <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                    <Mic className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-lg font-bold text-slate-700 dark:text-white">Tap to Speak</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">Converts voice to text immediately</span>
                </button>
              )}

              {isRecording && !showPermissionModal && (
                <div className="flex flex-col items-center z-10 w-full">
                  <div className="text-red-600 dark:text-red-400 font-mono text-3xl font-bold mb-6">
                    {formatTime(recordingDuration)}
                  </div>
                  
                  <button 
                    onClick={stopAndAnalyze}
                    className="flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0"
                  >
                    <Square className="h-5 w-5 mr-2 fill-current" />
                    Stop & Analyze
                  </button>
                  <p className="text-xs text-slate-500 mt-4">Transcribing & Analyzing...</p>
                </div>
              )}

              {audioBlob && !showPermissionModal && (
                <div className="w-full z-10">
                   <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
                      <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <Volume2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Audio Recorded</p>
                            <p className="text-xs text-slate-500">{formatTime(recordingDuration)} • {mimeType.split(';')[0]}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <audio src={audioUrl!} controls className="h-10 w-36 md:w-48" />
                        <button 
                          onClick={clearAudio}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          title="Discard & Record New"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                   </div>
                   {!loading && !result && (
                       <button
                         onClick={() => handlePredict(false)}
                         className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition-colors"
                       >
                         Analyze Recording
                       </button>
                   )}
                </div>
              )}
            </div>
          </div>

          <div className="relative flex items-center py-2">
             <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
             <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">EXTRACTED TEXT</span>
             <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Text Input Section (Auto-filled by Speech or Manual) */}
          <div className="relative">
             <div className="absolute top-3 left-3 pointer-events-none">
                <MessageSquare className="h-5 w-5 text-slate-400" />
             </div>
            <textarea
              id="tweet-input"
              rows={3}
              className={`w-full pl-10 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none ${isRecording ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
              placeholder="Your speech will appear here automatically..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              // Allowed to edit even if audio exists, to correct transcription
            ></textarea>
            {isRecording && (
                <div className="absolute top-3 right-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handlePredict(false)}
              disabled={loading || isRecording || (!inputText.trim() && !audioBlob)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-2 h-5 w-5" />
                  Analyze Input
                </>
              )}
            </button>
          </div>
        </div>

        {error && !showPermissionModal && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 m-6 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-bold text-red-800 dark:text-red-100">Analysis Failed</h3>
                <p className="text-sm text-red-700 dark:text-red-200 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Analysis Result</h3>
            
            <div className={`rounded-lg border p-5 flex items-start shadow-sm ${getResultColor(result.label)}`}>
              <div className="flex-shrink-0 mt-1">
                {getResultIcon(result.label)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                  <h4 className="text-xl font-bold">{result.label}</h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/60 dark:bg-black/20 border border-black/5 mt-2 sm:mt-0 w-fit">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-base opacity-90 leading-relaxed font-medium">{result.explanation}</p>
                
                {/* Display Transcription if available */}
                {result.transcription && (
                    <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10">
                        <p className="text-xs uppercase font-bold opacity-70 mb-1">Verified Transcription:</p>
                        <p className="text-sm font-mono opacity-90 bg-white/50 dark:bg-black/20 p-2 rounded">
                            "{result.transcription}"
                        </p>
                    </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demo;