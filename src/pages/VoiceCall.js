import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";

// ✅ Use environment variable or fallback
const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");


const VoiceCall = () => {
  const { state } = useLocation();
  const receiverId = state?.receiverId;
  const navigate = useNavigate();

  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnection = useRef(null);
  const streamRef = useRef(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    if (!receiverId) {
      alert("No receiver ID found");
      navigate("/dashboard");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((mediaStream) => {
        streamRef.current = mediaStream;
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = mediaStream;
        }

        peerConnection.current = new RTCPeerConnection(servers);

        mediaStream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, mediaStream);
        });

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              to: receiverId,
              candidate: event.candidate,
            });
          }
        };

        peerConnection.current.ontrack = (event) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = event.streams[0];
          }
        };

        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          socket.emit("register", userData._id);
        }

        socket.emit("call-user", { to: receiverId });

        socket.on("incoming-call", async ({ from }) => {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          socket.emit("send-offer", { to: from, offer });
        });

        socket.on("receive-offer", async ({ offer, from }) => {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.emit("send-answer", { to: from, answer });
        });

        socket.on("receive-answer", async ({ answer }) => {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          setIsCallActive(true);
        });

        socket.on("ice-candidate", async ({ candidate }) => {
          if (candidate) {
            try {
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(candidate)
              );
            } catch (e) {
              console.error("Error adding received ICE candidate", e);
            }
          }
        });
      })
      .catch((err) => {
        console.error("Error accessing audio device.", err);
        alert("Could not access microphone.");
        navigate("/dashboard");
      });

    return () => {
      socket.off("incoming-call");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("ice-candidate");
      socket.disconnect();

      if (peerConnection.current) peerConnection.current.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [receiverId, navigate]);

  const toggleMic = () => {
    if (!streamRef.current) return;
    const enabled = !isMicOn;
    setIsMicOn(enabled);
    streamRef.current.getAudioTracks()[0].enabled = enabled;
  };

  const endCall = () => {
    if (peerConnection.current) peerConnection.current.close();
    if (streamRef.current)
      streamRef.current.getTracks().forEach((track) => track.stop());
    navigate("/dashboard");
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        🎧 Voice Call In Progress
      </h2>

      <div className="flex flex-col items-center mb-6">
        <audio ref={localAudioRef} autoPlay muted />
        <audio ref={remoteAudioRef} autoPlay />
        <p className="text-gray-600 mt-2 text-sm">Connecting audio stream...</p>
      </div>

      <div className="flex gap-6">
        <button
          onClick={toggleMic}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
        >
          {isMicOn ? "🔇 Mute" : "🎙️ Unmute"}
        </button>
        <button
          onClick={endCall}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition"
        >
          🔚 End Call
        </button>
      </div>
    </div>
  );
};

export default VoiceCall;
