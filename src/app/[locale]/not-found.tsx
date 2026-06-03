import {Button} from '@/components/ui/Button';
import {GradientText} from '@/components/ui/GradientText';

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-32 text-center sm:px-6">
      <GradientText
        as="span"
        variant="spectrum"
        className="font-mono text-6xl font-semibold"
      >
        404
      </GradientText>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="text-muted">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Button href="/">Back home</Button>
    </section>
  );
}
