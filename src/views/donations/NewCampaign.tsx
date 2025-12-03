import { useState, type ChangeEvent } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../service/api';
import type { CampaignInput } from '../../api/firestore';

const initialValues = {
  orgName: '',
  title: '',
  goal: '',
  pixKey: '',
  contact: '',
  imageUrl: '',
  description: '',
};

const schema = Yup.object({
  orgName: Yup.string().required('Obrigatório'),
  title: Yup.string().required('Obrigatório'),
  goal: Yup.number().positive('Informe um valor maior que zero').required('Obrigatório'),
  pixKey: Yup.string().optional(),
  contact: Yup.string().required('Obrigatório'),
  imageUrl: Yup.string().url('URL inválida').optional(),
  description: Yup.string().required('Obrigatório'),
});

const NewCampaign = () => {
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
          <h2 className="text-2xl font-semibold text-slate-900">Cadastrar Nova Campanha de Doação</h2>
          <p className="text-sm text-slate-500">
            Crie uma campanha para arrecadar fundos para causas animais
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
                imageUrl = await api.uploadCampaignImage(selectedFile);
              }
              const payload: CampaignInput = {
                ...values,
                goal: Number(values.goal),
                amountRaised: 0,
                imageUrl,
              };
              await api.createCampaign(payload);
              alert('Campanha criada com sucesso.');
              helpers.resetForm();
              setSelectedFile(null);
              setPreview(null);
            } catch (err) {
              console.error('Erro ao criar campanha', err);
              alert('Erro ao salvar. Verifique o console.');
            } finally {
              setUploading(false);
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, isSubmitting }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 font-medium">Nome da Organização *</label>
                <input
                  name="orgName"
                  value={values.orgName}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="Ex: ONG Patas Solidárias"
                />
                {touched.orgName && errors.orgName && (
                  <p className="text-sm text-rose-500 mt-1">{errors.orgName}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">Nome da Causa *</label>
                <input
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="Ex: Resgate e Tratamento Veterinário"
                />
                {touched.title && errors.title && (
                  <p className="text-sm text-rose-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">Meta de Arrecadação (R$) *</label>
                <input
                  name="goal"
                  type="number"
                  value={values.goal}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="5000"
                />
                {touched.goal && errors.goal && <p className="text-sm text-rose-500 mt-1">{errors.goal}</p>}
              </div>

              <div>
                <label className="text-sm text-slate-600 font-medium">Contato *</label>
                <input
                  name="contact"
                  value={values.contact}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="contato@organizacao.org"
                />
                {touched.contact && errors.contact && (
                  <p className="text-sm text-rose-500 mt-1">{errors.contact}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-slate-600 font-medium">Chave PIX (opcional)</label>
                <input
                  name="pixKey"
                  value={values.pixKey}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="pix@organizacao.org"
                />
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
                <label className="text-sm text-slate-600 font-medium">Descrição da Campanha *</label>
                <textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full mt-1 rounded-xl bg-slate-100 px-3 py-2 outline-none"
                  placeholder="Descreva para que será utilizado o dinheiro arrecadado e como ajudará os animais..."
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
                  {isSubmitting || uploading ? 'Enviando...' : 'Criar Campanha'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default NewCampaign;
