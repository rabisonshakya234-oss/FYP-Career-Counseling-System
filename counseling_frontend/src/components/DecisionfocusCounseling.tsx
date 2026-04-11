import React, { useState } from "react";
import axios from "axios";
import "../CSS/DecisionFocusedCounseling.css";

// Interfaces
interface ProConItem {
    text: string;
    weight: number;
    category: string;
}

interface CareerOption {
    id: number;
    optionName: string;
    pros: ProConItem[];
    cons: ProConItem[];
}

interface CareerDecision {
    id?: number;
    title: string;
    options: CareerOption[];
}

interface Props {
    decisionTitle: string;
    optionNames: string[];
}

interface CardInputSate {
    proText: string;
    conText: string;
    weight: number;
    category: string;
}

// Function component (NOT React.FC)
function DecisionFocusedCounseling({ decisionTitle, optionNames }: Props) {
    const [options, setOptions] = useState<CareerOption[]>(
        (optionNames ?? []).map((name, idx) => ({
            id: idx,
            optionName: name,
            pros: [],
            cons: [],
        }))
    );

    const [cardInputs, setCardInputs] = useState<CardInputSate[]>(
        (optionNames ?? []).map(() => ({
            proText: "",
            conText: "",
            weight: 1,
            category: "Salary",
        }))
    );

    const updateCardInput = (optionId: number, field: keyof CardInputSate, value: string | number): void => {
        const updated = [...cardInputs];
        updated[optionId] = { ...updated[optionId], [field]: value };
        setCardInputs(updated);
    };


    const addPro = (optionId: number): void => {
        if (!cardInputs[optionId].proText.trim()) return; // ✅ FIXED: prevent empty pro
        const newOptions = [...options];
        newOptions[optionId].pros.push({
            text: cardInputs[optionId].proText,
            weight: cardInputs[optionId].weight,
            category: cardInputs[optionId].category,
        });
        setOptions(newOptions);
        updateCardInput(optionId, "proText", "");
    };

    const addCon = (optionId: number): void => {
        if (!cardInputs[optionId].conText.trim()) return; // ✅ FIXED: prevent empty con
        const newOptions = [...options];
        newOptions[optionId].cons.push({
            text: cardInputs[optionId].conText,
            weight: cardInputs[optionId].weight,
            category: cardInputs[optionId].category,
        });
        setOptions(newOptions);
        updateCardInput(optionId, "conText", "");
    };

    const submitDecision = async (): Promise<void> => {

        if (!decisionTitle || decisionTitle.trim() === "") {
            alert("Decision title is missing. Please provide a title for your career decision.");
            return;
        }

        if (!options || options.length === 0) {
            alert("No career options added. Please add at least one option to compare.");
            return;
        }
        const decision: CareerDecision = {
            title: decisionTitle.trim(),
            options,
        };
        // any circular reference issues should be caught by TypeScript's type system, but we can also do a quick check here
        let serialized: string;
        try {
            serialized = JSON.stringify(decision);
        } catch (serializeError) {
            console.error("Decision object could not be serialized:", serializeError);
            alert("Internal error: decision data is invalid.");
            return;
        }

        console.log("Sending decision payload:", serialized); //  debug log

        try {

            const accessToken = localStorage.getItem("accessToken");
            //  Matched backend base path "/api/decision"
            //  Kept port 3000 (as instructed)
            // Removed `${id}` because POST route does not require id
            const res = await axios.post(`http://localhost:3000/api/decision/decision`,
                decision,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert(`Decision saved with ID: ${res.data._id}`);
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err?.response?.status} - ${JSON.stringify(err?.response?.data)}`);
        }
    };

    if (!optionNames || optionNames.length === 0) {
        return (
            <div className="dcf-page">
                <div className="dcf-page-header">
                    <div className="dcf-page-header-inner">
                        <div className="dcf-header-icon">🎯</div>
                        <div>
                            <h2 className="dcf-page-title">{decisionTitle ?? "Career Decision"}</h2>
                            <p className="dcf-page-subtitle">No career options provided yet.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (

        <div className="dcf-page">
            {/* ── Page Header ── */}
            <div className="dcf-page-header mt-5 mb-3">
                <div className="dcf-page-header-inner">
                    <div className="dcf-header-icon">🎯</div>
                    <div>
                        <h2 className="dcf-page-title">{decisionTitle}</h2>
                        <p className="dcf-page-subtitle">Compare your career options by adding pros and cons with weights</p>
                    </div>
                </div>
            </div>

            {/* ── Cards Grid ── */}
            <div className="dcf-grid">
                {options.map((option) => (
                    <div key={option.id} className="dcf-card">

                        {/* Card Header */}
                        <div className="dcf-card-header">
                            <div className="dcf-card-header-left">
                                <div className="dcf-option-badge">{option.id + 1}</div>
                                <h3 className="dcf-card-title">{option.optionName}</h3>
                            </div>
                            <div className="dcf-score-pills">
                                <span className="dcf-pro-pill">✓ {option.pros.length} pros</span>
                                <span className="dcf-con-pill">✗ {option.cons.length} cons</span>
                            </div>
                        </div>

                        <div className="dcf-card-body">

                            {/* Shared inputs row */}
                            <div className="dcf-shared-inputs-row">
                                <div className="dcf-input-group">
                                    <label className="dcf-label">Category</label>
                                    <select value={cardInputs[option.id].category} onChange={(e) => updateCardInput(option.id, "category", e.target.value)} className="dcf-select">
                                        <option value="Salary">Salary</option>
                                        <option value="Growth">Growth</option>
                                        <option value="Work-Life Balance">Work-Life Balance</option>
                                        <option value="Skills Match">Skills Match</option>
                                        <option value="Personal Satisfaction">Personal Satisfaction</option>
                                    </select>
                                </div>
                                <div className="dcf-input-group">
                                    <label className="dcf-label">Weight (1–5)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={5}
                                        value={cardInputs[option.id].weight}
                                        onChange={(e) => updateCardInput(option.id, "weight", parseInt(e.target.value))}
                                        className="dcf-input dcf-input-small"
                                    />
                                </div>
                            </div>

                            <div className="dcf-procon-grid">

                                {/* ── PRO SECTION ── */}
                                <div className="dcf-pro-section">
                                    <div className="dcf-section-header">
                                        <span className="dcf-pro-icon">✓</span>
                                        <h4 className="dcf-pro-heading">Pros</h4>
                                    </div>
                                    <div className="dcf-add-row">
                                        <input
                                            placeholder="Add a pro..."
                                            value={cardInputs[option.id].proText}
                                            onChange={(e) => updateCardInput(option.id, "proText", e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addPro(option.id)}
                                            className="dcf-input"
                                        />
                                        <button onClick={() => addPro(option.id)} className="dcf-btn-pro">
                                            + Add
                                        </button>
                                    </div>
                                    <ul className="dcf-list">
                                        {option.pros.map((p, idx) => (
                                            <li key={idx} className="dcf-pro-item">
                                                <span className="dcf-item-dot-pro">●</span>
                                                <span className="dcf-item-text">{p.text}</span>
                                                <span className="dcf-item-meta">
                                                    <span className="dcf-weight-badge">W:{p.weight}</span>
                                                    <span className="dcf-category-badge">{p.category}</span>
                                                </span>
                                            </li>
                                        ))}
                                        {option.pros.length === 0 && (
                                            <li className="dcf-empty-hint">No pros added yet</li>
                                        )}
                                    </ul>
                                </div>

                                {/* ── CON SECTION ── */}
                                <div className="dcf-con-section">
                                    <div className="dcf-section-header">
                                        <span className="dcf-con-icon">✗</span>
                                        <h4 className="dcf-con-heading">Cons</h4>
                                    </div>
                                    <div className="dcf-add-row">
                                        <input
                                            placeholder="Add a con..."
                                            value={cardInputs[option.id].conText}
                                            onChange={(e) => updateCardInput(option.id, "conText", e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addCon(option.id)}
                                            className="dcf-input"
                                        />
                                        <button onClick={() => addCon(option.id)} className="dcf-btn-con">
                                            + Add
                                        </button>
                                    </div>
                                    <ul className="dcf-list">
                                        {option.cons.map((c, idx) => (
                                            <li key={idx} className="dcf-con-item">
                                                <span className="dcf-item-dot-con">●</span>
                                                <span className="dcf-item-text">{c.text}</span>
                                                <span className="dcf-item-meta">
                                                    <span className="dcf-weight-badge">W:{c.weight}</span>
                                                    <span className="dcf-category-badge">{c.category}</span>
                                                </span>
                                            </li>
                                        ))}
                                        {option.cons.length === 0 && (
                                            <li className="dcf-empty-hint">No cons added yet</li>
                                        )}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Save Button ── */}
            <div className="dcf-footer">
                <button onClick={submitDecision} className="dcf-btn-save">
                    💾 Save Decision
                </button>
            </div>

        </div>
    );
}

export default DecisionFocusedCounseling;