export const productDataValidate = (data: any): boolean => {
  const { title, description, count, price } = data;
  return (
    typeof title === 'string' &&
    title.length > 0 &&
    typeof description === 'string' &&
    description.length > 0 &&
    +count > 0 &&
    +price > 0
  );
};
