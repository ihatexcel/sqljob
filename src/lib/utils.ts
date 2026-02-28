// @ts-nocheck

export function ico(name: string, size = '1rem'): string {
    return `<span class="iconify" data-icon="${name}" style="font-size:${size}"></span>`;
}

export function formatValueForInputType(value, inputType) {
            if (value === null || value === undefined || value === '') return '';

            // Essayer de parser comme Date si nécessaire
            let dateObj = null;
            if (value instanceof Date) {
                dateObj = value;
            } else if (typeof value === 'number') {
                // Timestamp en millisecondes
                dateObj = new Date(value);
            } else if (typeof value === 'string') {
                // Essayer de parser la string comme date
                const parsed = new Date(value);
                if (!isNaN(parsed.getTime())) {
                    dateObj = parsed;
                }
            }

            // Formater selon le type d'input
            switch (inputType) {
                case 'date':
                    if (dateObj) {
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    }
                    break;
                case 'datetime-local':
                    if (dateObj) {
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        const hours = String(dateObj.getHours()).padStart(2, '0');
                        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                        return `${year}-${month}-${day}T${hours}:${minutes}`;
                    }
                    break;
                case 'time':
                    if (dateObj) {
                        const hours = String(dateObj.getHours()).padStart(2, '0');
                        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                        return `${hours}:${minutes}`;
                    }
                    // Si c'est déjà une string de temps (HH:mm ou HH:mm:ss)
                    if (typeof value === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(value)) {
                        const parts = value.split(':');
                        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
                    }
                    break;
                case 'month':
                    if (dateObj) {
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        return `${year}-${month}`;
                    }
                    break;
                case 'week':
                    if (dateObj) {
                        // Calculer le numéro de semaine ISO
                        const tempDate = new Date(dateObj.getTime());
                        tempDate.setHours(0, 0, 0, 0);
                        tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
                        const week1 = new Date(tempDate.getFullYear(), 0, 4);
                        const weekNum = 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
                        return `${tempDate.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
                    }
                    break;
            }

            // Par défaut, retourner la valeur convertie en string
            return String(value);
        }
