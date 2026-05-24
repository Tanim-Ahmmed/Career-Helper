import { SiteNavbar } from "@/components/sections/site-navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteNavbar />
      {children}
    </>
  );
}
