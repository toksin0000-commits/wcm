"use client";

import { useState, useEffect } from "react";
import Timeline from "./Timeline";
import AIChat from "./AIChat";
import conflicts from "@/data/conflicts.json";

// Interface definition updated for English data structure
interface ConflictData {
  id: string;
  name: string;
  summary_short: string;
  summary_long: string;
  timeline: any[];
  humanitarian: {
    refugees: number;
    idps: number;
    civilian_casualties: number;
  };
  arsenal?: {
    country: string;
    categories: {
      [key: string]: string[];
    };
  }[];
}

interface ConflictPanelProps {
  conflictId: string | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function ConflictPanel({ conflictId, onClose, isOpen }: ConflictPanelProps) {
  const [activeTab, setActiveTab] = useState("context");
  const [displayText, setDisplayText] = useState("");
  const [panelOpacity, setPanelOpacity] = useState(0); 
  
  const conflict = conflicts.find((c) => c.id === conflictId) as ConflictData | undefined;

  useEffect(() => {
    if (isOpen) {
      setPanelOpacity(0);
      const timeout = setTimeout(() => setPanelOpacity(0.6), 50);
      return () => clearTimeout(timeout);
    } else {
      setPanelOpacity(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (conflictId) {
      setActiveTab("context");
    }
  }, [conflictId]);

  useEffect(() => {
    if (isOpen && activeTab === "context" && conflict?.summary_long) {
      setDisplayText("");
      let i = 0;
      const fullText = conflict.summary_long;
      
      const interval = setInterval(() => {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
        if (i >= fullText.length) {
          clearInterval(interval);
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [isOpen, activeTab, conflictId, conflict]);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '520px',
        zIndex: 1000,
        backgroundColor: `rgba(2, 6, 23, ${panelOpacity})`,
        backdropFilter: `blur(${panelOpacity * 3.33}px)`,
        WebkitBackdropFilter: `blur(${panelOpacity * 3.33}px)`,
        borderTop: '1px solid rgba(0, 242, 255, 0.3)',
        padding: '30px',
        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), background-color 2s ease, backdrop-filter 0.5s ease',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        pointerEvents: isOpen ? 'auto' : 'none',
        clipPath: 'polygon(0 25px, 25px 0, 100% 0, 100% 100%, 0 100%)',
        animation: 'panelPulse 3s infinite',
      }}
    >
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '25px',
          background: 'none',
          border: 'none',
          color: '#00f2ff',
          fontFamily: 'monospace',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 1100,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        [×]
      </button>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'rgba(0, 242, 255, 0.15)',
        boxShadow: '0 0 15px #00f2ff',
        animation: 'scanline 4s linear infinite',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: panelOpacity,
      }} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {isOpen && !conflict && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ color: '#00f2ff', animation: 'pulse 2s infinite', fontFamily: 'monospace' }}>
              INITIALIZING DATA UPLOAD...
            </p>
          </div>
        )}
        
        {!isOpen && !conflict && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ color: 'rgba(0, 242, 255, 0.5)', fontFamily: 'monospace' }}>
              AWAITING SECTOR SELECTION
            </p>
          </div>
        )}
        
        {conflict && (
          <>
            <div style={{ marginBottom: '16px', height: '80px' }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#00f2ff', 
                textTransform: 'uppercase', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                <span style={{ 
                  width: '4px', 
                  height: '20px', 
                  backgroundColor: '#00f2ff', 
                  boxShadow: '0 0 10px #00f2ff' 
                }}></span>
                {conflict.name}
              </h2>
              <p style={{ 
                fontSize: '11px', 
                color: '#0891b2', 
                fontStyle: 'italic', 
                marginTop: '4px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {conflict.summary_short}
              </p>
            </div>

            <div style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 242, 255, 0.1)',
              padding: '4px',
              marginBottom: '16px',
              height: '45px', 
              overflowX: 'auto', 
              whiteSpace: 'nowrap', 
              scrollbarWidth: 'none', 
              WebkitOverflowScrolling: 'touch', 
            }}>
              {["context", "timeline", "arsenal", "humanitarian", "ai"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{
                    flex: '0 0 auto',
                    padding: '0 20px',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: activeTab === t ? '#00f2ff' : '#0891b2',
                    backgroundColor: activeTab === t ? 'rgba(0, 242, 255, 0.1)' : 'transparent',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: activeTab === t ? '2px solid #00f2ff' : '2px solid transparent',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                >
                  {t === "humanitarian" ? "Impact" : 
                   t === "ai" ? "Tactical AI" : 
                   t === "context" ? "Context" : 
                   t === "timeline" ? "Timeline" : 
                   t === "arsenal" ? "Arsenal" : t}
                </button>
              ))}
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '8px',
            }} className="custom-scrollbar">
              
              {activeTab === "context" && (
                <div style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'rgba(0, 242, 255, 0.7)', 
                    lineHeight: '1.7',
                    fontFamily: 'monospace',
                  }}>
                    {displayText}
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '16px',
                      backgroundColor: '#00f2ff',
                      marginLeft: '4px',
                      animation: 'pulse 1s infinite',
                    }}></span>
                  </div>
                </div>
              )}
              
              {activeTab === "timeline" && (
                <div style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
                  <Timeline items={conflict.timeline} />
                </div>
              )}

              {activeTab === "arsenal" && conflict.arsenal && (
                <div style={{ 
                  animation: 'fadeIn 0.4s ease-out forwards',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  {conflict.arsenal.map((group: any, i: number) => (
                    <div key={i} style={{
                      backgroundColor: 'rgba(0, 242, 255, 0.03)',
                      border: '1px solid rgba(0, 242, 255, 0.15)',
                      padding: '16px',
                      borderRadius: '4px'
                    }}>
                      <h3 style={{ color: '#00f2ff', fontSize: '13px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid rgba(0, 242, 255, 0.3)', paddingBottom: '5px', fontFamily: 'monospace' }}>
                        {group.country}
                      </h3>
                      {Object.entries(group.categories || {}).map(([catName, items]: any) => (
                        <div key={catName} style={{ marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>
                            {catName}
                          </h4>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {items.map((item: string, idx: number) => (
                              <li key={idx} style={{ fontSize: '11px', color: 'white', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', fontFamily: 'monospace' }}>
                                <span style={{ width: '3px', height: '3px', background: '#00f2ff' }}></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "humanitarian" && (
                <div style={{ 
                  animation: 'fadeIn 0.4s ease-out forwards',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                }}>
                  <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Refugees</div>
                    <div style={{ fontSize: '18px', color: '#00f2ff', fontWeight: 'bold' }}>{conflict.humanitarian.refugees.toLocaleString()}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>IDPs</div>
                    <div style={{ fontSize: '18px', color: '#00f2ff', fontWeight: 'bold' }}>{conflict.humanitarian.idps.toLocaleString()}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#0891b2', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Casualties</div>
                    <div style={{ fontSize: '18px', color: 'rgba(255, 0, 0, 0.8)', fontWeight: 'bold' }}>{conflict.humanitarian.civilian_casualties.toLocaleString()}</div>
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <div style={{ animation: 'fadeIn 0.4s ease-out forwards', height: '320px' }}>
                  <AIChat conflictId={conflict.id} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}