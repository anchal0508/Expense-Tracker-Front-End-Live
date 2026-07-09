import { Crown, SquareX, CheckCircle } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";

const PremiumModal = () => {
    const { isPremiumModalOpen, setIsPremiumModalOpen, handlePayment, premiumLoad, premiumMsg } = useExpenses();

    if (!isPremiumModalOpen) return null; 

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(5px)'
        }}>
            <div className="box" style={{
                width: '450px', padding: '30px', background: '#0d1b2a', 
                border: '2px solid gold', borderRadius: '15px', position: 'relative',
                boxShadow: '0px 0px 20px gold', color: '#fff', textAlign: 'center'
            }}>
                <span 
                    onClick={() => setIsPremiumModalOpen(false)} 
                    style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', color: 'gray' }}
                >
                    <SquareX size={25} />
                </span>

                <Crown size={50} color="gold" style={{ marginBottom: '15px', filter: 'drop-shadow(0 0 10px gold)' }} />
                <h2 style={{ color: 'gold', marginBottom: '20px' }}>Upgrade to Premium Gold</h2>

                <div style={{ textAlign: 'left', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <CheckCircle size={18} color="gold" />
                        <span>Unlock Analytics Charts & Real-time Graphs 📊</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <CheckCircle size={18} color="gold" />
                        <span>Access global Peer Leaderboard rank list 🏆</span>
                    </div>
                </div>

                <button 
                    onClick={handlePayment}
                    className="gold-btn"
                    disabled={premiumLoad}
                    style={{ width: '100%', padding: '12px', fontSize: '16px', fontWeight: 'bold' }}
                >
                    {premiumLoad ? "ProcessingSecure Gateway..." : "Activate Premium - ₹399"}
                </button>

                {premiumMsg && (
                    <p style={{ marginTop: '15px', color: premiumMsg.includes('Failed') ? 'red' : 'gold', fontSize: '14px' }}>
                        {premiumMsg}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PremiumModal;
