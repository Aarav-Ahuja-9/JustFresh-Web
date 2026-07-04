export default function Contact() {
  return (
    <div className="min-h-screen py-12 bg-gray-50 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md border-t-4 border-green-600">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Contact Us</h2>
        <p className="text-gray-500 mb-6">Have an inquiry? Send us a message.</p>
        <form className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" className="w-full border rounded p-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" className="w-full border rounded p-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Message</label><textarea className="w-full border rounded p-2" rows={5}></textarea></div>
          <button type="button" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded">Send Message</button>
        </form>
      </div>
    </div>
  );
}