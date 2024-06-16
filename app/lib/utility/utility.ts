export const formatDateTime = (datetime: Date) => {
    const day = datetime.getDate().toString().padStart(2, '0');
    const month = (datetime.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-indexed month
    const year = datetime.getFullYear();
    const hours = datetime.getHours().toString().padStart(2, '0');
    const minutes = datetime.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const getMoscowoffsetTimeString = (datetime: string) => {
    // Create a new Date object representing the UTC date from the string
    const utcDate = new Date(datetime);
  
    // Get the offset in hours (assuming datetime has 'Z' for UTC)
    const offset = utcDate.getTimezoneOffset() / 60;
  
    // Add 3 hours to the UTC date
    utcDate.setHours(utcDate.getHours() + offset + 3);
  
    // Return the ISO string of the modified UTC date
    return utcDate;
  };