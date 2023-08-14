export function formatDate(dateArray) {
    const [year, month, day] = dateArray;
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString('ro-RO', options);
    return formattedDate;
  
  }