export const clearOldSession = () => {
    const sessionKeys = [
        'VI_PRO',
        'PAY_USER_TOKEN',
        'PAY_USER_NAME',
        'PAY_USER_IMG',
        'U_FORGET_EMAIL',
        'PAY_USER_FIRM_NAME',
        'PAY_USER_START_YEAR',
        'PAY_USER_END_YEAR',
        'PAY_USER_YEAR_ID',
        'PAY_USER_FIRM_ID',
        'PAY_USER_ID',
        'U_PROJECT_ID',
        'PAY_USER_PROJECT_NAME',
        'ERP_ROLE'
    ];

    sessionKeys.forEach(key => localStorage.removeItem(key));

    // Optional: clear remember me only if false
    if (localStorage.getItem('PAY_USER_REMEMBER_ME') === "false") {
        localStorage.removeItem('PAY_USER_PASSWORD');
        localStorage.removeItem('PAY_USER_EMAIL');
        localStorage.removeItem('PAY_USER_REMEMBER_ME');
    }
};
