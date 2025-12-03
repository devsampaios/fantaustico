import { useState, type ChangeEvent } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../service/api';
import type { PetInput, ReportInput } from '../../api/firestore';

const initialValues = {
  type: 'perdido',
  name: '',
  species: '',
  breed: '',
  ageLabel: '',
  status: 'perdido',
  location: '',
  contact: '',
  contactName: '',
  contactEmail: '',
  imageUrl: '',
  description: '',
};

const schema = Yup.object({
  type: Yup.string().required('Obrigatório'),
  name: Yup.string().required('Obrigatório'),
  species: Yup.string().required('Obrigatório'),
  breed: Yup.string().required('Obrigatório'),
  ageLabel: Yup.string().required('Obrigatório'),
  status: Yup.string().required('Obrigatório'),
  location: Yup.string().required('Obrigatório'),
  contact: Yup.string().required('Obrigatório'),
  contactName: Yup.string().optional(),
  contactEmail: Yup.string().email('Email inválido').optional(),
  imageUrl: Yup.string().url('URL inválida').optional(),
  description: Yup.string().required('Obrigatório'),
});

const RegisterPet = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

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
          onSubmit={async (values, helpers) => {
            try {
              let imageUrl = values.imageUrl;
              if (selectedFile) {
                setUploading(true);
                imageUrl = await api.uploadPetImage(selectedFile);
              }
              const payload: PetInput = { ...values, imageUrl };
              const isCase = values.type === 'perdido' || values.type === 'denuncia';

              if (isCase) {
                const reportPayload: ReportInput = {
                  targetType: 'pet',
                  reason: values.type === 'denuncia' ? 'Denúncia de maus tratos' : 'Pet perdido',
                  description: values.description,
                  contact: values.contact,
                  type: values.type,
                  status: values.status,
                  name: values.name,
                  species: values.species,
                  breed: values.breed,
                  ageLabel: values.ageLabel,
                  location: values.location,
                  imageUrl,
                  contactName: values.contactName,
                  contactEmail: values.contactEmail,
                };
                await api.createReport(reportPayload);
              } else {
                await api.createPet(payload);
              }
              alert('Registro criado com sucesso.');
              helpers.resetForm();
              setSelectedFile(null);
              setPreview(null);
            } catch (err) {
              console.error('Erro ao criar pet', err);
              alert('Erro ao salvar. Verifique o console.');
            } finally {
              setUploading(false);
              helpers.setSubmitting(false);
            }
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
                  name="ageLabel"
                  value={values.ageLabel}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="Ex: 3 anos"
                />
                {touched.ageLabel && errors.ageLabel && (
                  <p className="text-sm text-rose-500 mt-1">{errors.ageLabel}</p>
                )}
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

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div>
                  <label className="text-sm text-slate-600 font-medium">Nome para contato</label>
                  <input
                    name="contactName"
                    value={values.contactName}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                    placeholder="Ex: Maria Silva"
                  />
                  {touched.contactName && errors.contactName && (
                    <p className="text-sm text-rose-500 mt-1">{errors.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-slate-600 font-medium">Email (opcional)</label>
                  <input
                    name="contactEmail"
                    type="email"
                    value={values.contactEmail}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                    placeholder="contato@exemplo.com"
                  />
                  {touched.contactEmail && errors.contactEmail && (
                    <p className="text-sm text-rose-500 mt-1">{errors.contactEmail}</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 font-medium">
                    Upload de Imagem ou Foto (opcional)
                  </label>
                  <div className="mt-1 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="text-sm"
                    />
                    {preview && (
                      <div className="h-32 rounded-lg overflow-hidden bg-slate-100">
                        <img src={preview} alt="Pré-visualização" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
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
                  disabled={isSubmitting || uploading}
                  className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-white font-semibold shadow-lg shadow-primary/30 disabled:opacity-70"
                >
                  {isSubmitting || uploading ? 'Enviando...' : 'Cadastrar Pet'}
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
