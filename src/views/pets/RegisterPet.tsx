import { Form, Formik } from 'formik';
import * as Yup from 'yup';

const initialValues = {
  type: 'perdido',
  name: '',
  species: '',
  breed: '',
  age: '',
  status: 'perdido',
  location: '',
  contact: '',
  imageUrl: '',
  description: '',
};

const schema = Yup.object({
  type: Yup.string().required('Obrigatório'),
  name: Yup.string().required('Obrigatório'),
  species: Yup.string().required('Obrigatório'),
  breed: Yup.string().required('Obrigatório'),
  age: Yup.string().required('Obrigatório'),
  status: Yup.string().required('Obrigatório'),
  location: Yup.string().required('Obrigatório'),
  contact: Yup.string().required('Obrigatório'),
  imageUrl: Yup.string().url('URL inválida').optional(),
  description: Yup.string().required('Obrigatório'),
});

function RegisterPet() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="glass rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Cadastrar Novo Registro</h2>
          <p className="text-sm text-slate-500">
            Registre um pet ou faça uma denúncia de maus tratos
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={(values, helpers) => {
            console.log('Registro de pet', values);
            helpers.setSubmitting(false);
            alert('Registro enviado (mock). Confira o console.');
          }}
        >
          {({ values, errors, touched, handleChange, isSubmitting }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm text-slate-600 font-medium">Tipo de Registro *</label>
                <select
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                >
                  <option value="perdido">Perdido</option>
                  <option value="encontrado">Encontrado</option>
                  <option value="adocao">Adoção</option>
                  <option value="denuncia">Denúncia</option>
                </select>
                {touched.type && errors.type && <p className="text-sm text-rose-500 mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">Nome do Pet *</label>
                <input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="Ex: Thor"
                />
                {touched.name && errors.name && <p className="text-sm text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">Espécie *</label>
                <input
                  name="species"
                  value={values.species}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="Selecione a espécie"
                />
                {touched.species && errors.species && (
                  <p className="text-sm text-rose-500 mt-1">{errors.species}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">Raça *</label>
                <input
                  name="breed"
                  value={values.breed}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="Ex: Labrador"
                />
                {touched.breed && errors.breed && <p className="text-sm text-rose-500 mt-1">{errors.breed}</p>}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">Idade *</label>
                <input
                  name="age"
                  value={values.age}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="Ex: 3 anos"
                />
                {touched.age && errors.age && <p className="text-sm text-rose-500 mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">Status *</label>
                <select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                >
                  <option value="perdido">Perdido</option>
                  <option value="encontrado">Encontrado</option>
                  <option value="para_adocao">Para Adoção</option>
                </select>
                {touched.status && errors.status && (
                  <p className="text-sm text-rose-500 mt-1">{errors.status}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">Localização *</label>
                <input
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="Ex: Jardim Paulista, São Paulo"
                />
                {touched.location && errors.location && (
                  <p className="text-sm text-rose-500 mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">Contato *</label>
                <input
                  name="contact"
                  value={values.contact}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="(11) 98765-4321"
                />
                {touched.contact && errors.contact && (
                  <p className="text-sm text-rose-500 mt-1">{errors.contact}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-slate-600 font-medium">URL da Imagem (opcional)</label>
                <input
                  name="imageUrl"
                  value={values.imageUrl}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                {touched.imageUrl && errors.imageUrl && (
                  <p className="text-sm text-rose-500 mt-1">{errors.imageUrl}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-slate-600 font-medium">Descrição *</label>
                <textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="Descreva características, comportamento, local onde foi visto, etc."
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-rose-500 mt-1">{errors.description}</p>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="reset"
                  className="rounded-xl border border-slate-200 px-5 py-3 text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-white font-semibold shadow-lg shadow-primary/30 disabled:opacity-70"
                >
                  {isSubmitting ? 'Enviando...' : 'Cadastrar Pet'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RegisterPet;
