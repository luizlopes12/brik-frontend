import React from 'react'
export async function getStaticPaths() {
    const res = await fetch(`${process.env.BACKEND_URL}/lots/list`);
    const data = await res.json();
    const paths = data.map(lot => ({ params: { id: lot.id.toString() } }));
    return { paths, fallback: false };
  }
  export async function getStaticProps({ params }) {
    const res = await fetch(`${process.env.BACKEND_URL}/lots/${params.id}`);
    const data = await res.json();
    return { props: { lotData: data[0]} };
  }
const Form = ({lotData}) => {
  return (
    <div>{lotData.name}</div>
  )
}

export default Form