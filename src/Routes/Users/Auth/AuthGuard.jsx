import { M_CON, PAINT, PLAN, QA, QC, WELD } from "../../../BaseUrl";

const PlanningAuth = ({ children }) => {
    const isPlanningRole = localStorage.getItem('ERP_ROLE') === PLAN;
    if (!isPlanningRole) {
        return false;
    }
    return children;
}

const MaterialCoordinatorAuth = ({ children }) => {
    const MaterialCheck = localStorage.getItem('ERP_ROLE') === M_CON;
    if (!MaterialCheck) {
        return false;
    }
    return children;
}

const PlanningMaterialAuth = ({ children }) => {
    const PlannerMaterial = localStorage.getItem('ERP_ROLE') === M_CON || localStorage.getItem('ERP_ROLE') === PLAN
    if (!PlannerMaterial) {
        return false;
    }
    return children;
}

const PlannerQcAuth = ({ children }) => {
    const PlannerMaterial = localStorage.getItem('ERP_ROLE') === PLAN || localStorage.getItem('ERP_ROLE') === QC
    if (!PlannerMaterial) {
        return false;
    }
    return children;
}

const WeldingAuth = ({ children }) => {
    const WeldCheck = localStorage.getItem('ERP_ROLE') === WELD;
    if (!WeldCheck) {
        return false;
    }
    return children;
}

const PwhtAuth = ({ children }) => {
    const WeldCheck = localStorage.getItem('ERP_ROLE') === WELD || localStorage.getItem('ERP_ROLE') === QA;
    if (!WeldCheck) {
        return false;
    }
    return children;
}


const JointAuth = ({ children }) => {
    const JointCheck = localStorage.getItem('ERP_ROLE') === WELD || localStorage.getItem('ERP_ROLE') === PLAN;
    if (!JointCheck) {
        return false;
    }
    return children;
}


const PaintAuth = ({ children }) => {
    const PaintCheck = localStorage.getItem('ERP_ROLE') === PAINT;
    if (!PaintCheck) {
        return false;
    }
    return children;
}

const QaAuth = ({ children }) => {
    const QaCheck = localStorage.getItem('ERP_ROLE') === QA;
    if (!QaCheck) {
        return false;
    }
    return children;
}

export { PlanningAuth, MaterialCoordinatorAuth, PlanningMaterialAuth, WeldingAuth,JointAuth, PaintAuth, QaAuth, PlannerQcAuth, PwhtAuth }