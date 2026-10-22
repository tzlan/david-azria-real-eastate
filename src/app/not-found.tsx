import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <section className="plain-hero" aria-labelledby="nf-title">
        <p className="eyebrow">Erreur 404</p>
        <h1 id="nf-title" className="h1">Ce bien n’est plus en ligne.</h1>
        <p className="lead">Il a peut-être été vendu ou loué. D’autres biens vous attendent.</p>
        <p style={{ marginTop: 28 }}>
          <Link href="/acheter" className="btn btn-primary">Voir tous les biens</Link>
        </p>
      </section>
    </div>
  );
}
