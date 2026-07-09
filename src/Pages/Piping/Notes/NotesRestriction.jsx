import React from "react";
import { notesData } from "../../../helper/notes";

const NotesRestriction = () => {

    const groupedData = notesData?.reduce((acc, item) => {
        if (!acc[item.title]) {
            acc[item.title] = [];
        }
        acc[item.title].push(item.description);
        return acc;
    }, {});

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-sm">
                <h2 className="text-primary">Notes Restriction</h2>
                {Object.keys(groupedData).map((title, index) => (
                    <div key={index} className="mt-3">
                        <h3 className="text-dark fw-bold">{title}</h3>
                        <ul className="list-group list-group-flush">
                            {groupedData[title].map((desc, i) => (
                                <li key={i} className="list-group-item">
                                    <strong>{i + 1}.</strong> {desc}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotesRestriction;
