// Creating a common label component 
export default function Label({ children, htmlFor }){
  return (
    <label htmlFor={htmlFor} className="dark:text-dark-subtle text-light-subtle font-semibold">
      {children}
    </label>
  );
};