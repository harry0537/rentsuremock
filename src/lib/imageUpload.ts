export const uploadImage = async (file: File): Promise<string> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
 
  // Return a placeholder image URL
  return 'https://placehold.co/600x400';
}; 