import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import ImageModule from 'docxtemplater-image-module-free'
import fileSaver from 'file-saver'
import { isWebView, latinToCyrillic } from './helper.js'

export const generateDocx = async (
  templatePath,
  formData,
  fileName,
  language,
) => {
  const response = await fetch(templatePath)
  const content = await response.arrayBuffer()

  const zip = new PizZip(content)

  const base64ToUint8Array = (base64) => {
    const binary_string = atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i)
    }

    return bytes
  }

  const imageModule = new ImageModule({
    centered: false,
    getImage(tagValue) {
      const match = tagValue.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/)
      if (!match || !match[2]) throw new Error('Invalid image data format')
      if (match[2].length > 500000) throw new Error('Image data too large')
      return base64ToUint8Array(match[2])
    },
    getSize() {
      return [154, 68]
    },
  })

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    modules: [imageModule],
  })

  const jmbgParts = {}
  for (let i = 0; i < 13; i++) {
    jmbgParts[`jmbg_${i + 1}`] = formData.jmbg.charAt(i)
  }

  const getCurrentDate = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    return `${day}.${month}.${year}`
  }

  let fullName = formData.full_name
  let parentName = formData.parent_name
  let address = formData.address
  let addressAbroad = formData.address_abroad
  let city = formData.city

  if ('sr' === language) {
    fullName = latinToCyrillic(fullName)
    parentName = latinToCyrillic(parentName)
    address = latinToCyrillic(address)
    addressAbroad = latinToCyrillic(addressAbroad)
    city = latinToCyrillic(city)
  }

  doc.setData({
    ime_prezime: fullName,
    ime_roditelja: parentName,
    ...jmbgParts,
    adresa: address,
    adresa_inostranstvo: addressAbroad,
    grad: `${city}, ${formData.country}`,
    telefon: formData.telephone,
    email: formData.email,
    datum: getCurrentDate(),
    potpis: formData.signature,
  })

  doc.render()
  const out = doc.getZip().generate({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  if (isWebView()) {
    // Fallback for WebView – try manual download
    const blobUrl = URL.createObjectURL(out)
    const downloadLink = document.createElement('a')

    downloadLink.href = blobUrl
    downloadLink.download = fileName
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)
    downloadLink.click()

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl)
      document.body.removeChild(downloadLink)
    }, 3000)
  } else {
    fileSaver.saveAs(out, fileName)
  }
}
