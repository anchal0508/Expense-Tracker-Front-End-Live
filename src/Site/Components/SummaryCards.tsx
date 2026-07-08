import { Crown } from "lucide-react";

const SummaryCards = () => {
    return (
        <>

                <div className="side-box box"><h3>Monthly Income</h3><p>Rs.: </p></div>
                <div className="side-box box"><Crown className="premium-icon" size={16} /> <h3>Graph</h3></div>


                <div className="bt-card box"><Crown className="premium-icon" size={16} /> <h3>Previous Month</h3><p>Rs.: </p></div>
                <div className="bt-card box"><Crown className="premium-icon" size={16} /> <h3>Last Year</h3><p>Rs.: </p></div>
                <div className="bt-card box"><Crown className="premium-icon" size={16} /> <h3>Upcomming</h3><p>Rs.: </p></div>
                <div className="bt-card box"><Crown className="premium-icon" size={16} /> <h3>OverAll</h3><p>Rs.: </p></div>
                <div className="bt-card box"><Crown className="premium-icon" size={16} /> <h3>Money Saved in %</h3><p>Avg.: </p></div>

        </>
    );
}

export default SummaryCards;