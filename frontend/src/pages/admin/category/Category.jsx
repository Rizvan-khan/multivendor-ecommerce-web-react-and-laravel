import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Customtable from '../../tables/CustomTable'
import { api, getApiError } from '../../../api/https'; 

const ENDPOINT = '/admin/categories' // <-- apna route yahan badlo

const emptyForm = {
  name: '',
  slug: '',
  parent_id: '',
  commission_rate: '',
  tax_rate: '',
}

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')

// Laravel response kai shapes me aa sakta hai: [..] / {data:[..]} / {data:{data:[..]}} (paginate)
const extractList = (res) => {
  const body = res?.data
  if (Array.isArray(body)) return body
  if (Array.isArray(body?.data)) return body.data
  if (Array.isArray(body?.data?.data)) return body.data.data
  return []
}

const Category = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')

  // form modal
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null) // null = add mode
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({}) // field wise (422)
  const [formError, setFormError] = useState('') // general error
  const [saving, setSaving] = useState(false)

  // delete modal
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  /* ---------- API: list ---------- */
  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await api.get(ENDPOINT)
      setCategories(extractList(res))
    } catch (err) {
      setLoadError(err?.response?.data?.message || 'Could not load categories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  /* ---------- form helpers ---------- */
  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({
      name: row.name ?? '',
      slug: row.slug ?? '',
      parent_id: row.parent_id ?? '',
      commission_rate: row.commission_rate ?? '',
      tax_rate: row.tax_rate ?? '',
    })
    setErrors({})
    setFormError('')
    setFormOpen(true)
  }

  const closeForm = () => {
    if (saving) return
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setFormError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      // add mode me name se slug auto bane
      if (name === 'name' && editingId === null) next.slug = slugify(value)
      return next
    })
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  /* ---------- API: create / update ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setFormError('')

    const payload = {
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      parent_id: form.parent_id === '' ? null : Number(form.parent_id),
      commission_rate: form.commission_rate === '' ? '' : Number(form.commission_rate),
      tax_rate: form.tax_rate === '' ? '' : Number(form.tax_rate),
    }

    try {
      if (editingId === null) {
        await api.post(ENDPOINT, payload)
      } else {
        await api.put(`${ENDPOINT}/${editingId}`, payload)
      }
      setFormOpen(false)
      setEditingId(null)
      setForm(emptyForm)
      await fetchCategories()
    } catch (err) {
      if (err?.response?.status === 422) {
        // Laravel: { message, errors: { field: [msg] } }
        const fieldErrors = {}
        Object.entries(err.response.data?.errors || {}).forEach(([k, v]) => {
          fieldErrors[k] = Array.isArray(v) ? v[0] : v
        })
        setErrors(fieldErrors)
      } else {
        setFormError(err?.response?.data?.message || 'Something went wrong. Try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  /* ---------- API: delete ---------- */
  const confirmDelete = async () => {
    setDeleting(true)
    setDeleteError('')
    try {
      await api.delete(`${ENDPOINT}/${deleteTarget.id}`)
      setDeleteTarget(null)
      await fetchCategories()
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Could not delete this category.')
    } finally {
      setDeleting(false)
    }
  }

  /* ---------- table ---------- */
  const parentName = useCallback(
    (row) => {
      if (row.parent?.name) return row.parent.name
      if (!row.parent_id) return '—'
      return categories.find((c) => c.id === row.parent_id)?.name ?? `#${row.parent_id}`
    },
    [categories]
  )

  const columns = [
    { header: 'ID', accessor: 'id', width: 70 },
    { header: 'Name', accessor: 'name', width: 170 },
    { header: 'Slug', accessor: 'slug', width: 170 },
    { header: 'Parent', width: 150, render: (row) => parentName(row) },
    { header: 'Commission', width: 110, render: (row) => `${row.commission_rate}%` },
    { header: 'Tax', width: 90, render: (row) => `${row.tax_rate}%` },
    {
      header: 'Action',
      width: 160,
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEdit(row)}
            className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white px-3 py-1 rounded text-sm transition"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setDeleteError('')
              setDeleteTarget(row)
            }}
            className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded text-sm transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return categories
    return categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q)
    )
  }, [categories, search])

  // parent dropdown: edit karte waqt khud ko parent na bana sake
  const parentOptions = categories.filter((c) => c.id !== editingId)

  const inputCls = (field) =>
    `w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 ${
      errors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
        : 'border-gray-300 focus:border-yellow-500 focus:ring-yellow-500/30'
    }`

  const FieldError = ({ name }) =>
    errors[name] ? <p className="mt-1 text-xs text-red-600">{errors[name]}</p> : null

  return (
    <div className="w-full">
      {/* header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900">Category Management</h2>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category..."
            className={`${inputCls('_search')} sm:w-64`}
          />
          <button
            onClick={openAdd}
            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-700"
          >
            + Add category
          </button>
        </div>
      </div>

      {/* states */}
      {loading && <p className="py-8 text-center text-sm text-gray-500">Loading categories...</p>}

      {!loading && loadError && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {loadError}{' '}
          <button onClick={fetchCategories} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[760px]">
              <Customtable columns={columns} data={filtered} />
            </div>
          </div>

          {filtered.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              No categories found. Click “Add category” to create one.
            </p>
          )}
        </>
      )}

      {/* ---------- Add / Edit modal ---------- */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          onClick={closeForm}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-2xl"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {editingId === null ? 'Add category' : 'Edit category'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputCls('name')}
                  placeholder="e.g. Electronics"
                  autoFocus
                />
                <FieldError name="name" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className={inputCls('slug')}
                  placeholder="electronics"
                />
                <FieldError name="slug" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Parent category
                </label>
                <select
                  name="parent_id"
                  value={form.parent_id}
                  onChange={handleChange}
                  className={inputCls('parent_id')}
                >
                  <option value="">None (top level)</option>
                  {parentOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <FieldError name="parent_id" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Commission rate (%)
                  </label>
                  <input
                    type="number"
                    name="commission_rate"
                    value={form.commission_rate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className={inputCls('commission_rate')}
                    placeholder="10"
                  />
                  <FieldError name="commission_rate" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tax rate (%)
                  </label>
                  <input
                    type="number"
                    name="tax_rate"
                    value={form.tax_rate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className={inputCls('tax_rate')}
                    placeholder="18"
                  />
                  <FieldError name="tax_rate" />
                </div>
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-700 disabled:opacity-60"
              >
                {saving
                  ? 'Saving...'
                  : editingId === null
                  ? 'Add category'
                  : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------- Delete confirm modal ---------- */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-gray-900">Delete category?</h3>
            <p className="mt-2 text-sm text-gray-600">
              “{deleteTarget.name}” will be removed permanently. This can’t be undone.
            </p>
            {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Category