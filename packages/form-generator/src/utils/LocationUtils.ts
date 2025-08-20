// Utilidades para manejo de ubicaciones ecuatorianas
export interface Province {
  code: string;
  name: string;
  cantons: Canton[];
}

export interface Canton {
  code: string;
  name: string;
  provinceCode: string;
  parishes: Parish[];
}

export interface Parish {
  code: string;
  name: string;
  cantonCode: string;
  type: 'URBANA' | 'RURAL';
}

export class LocationUtils {
  private static readonly ECUADOR_LOCATIONS: Province[] = [
    {
      code: '01',
      name: 'Azuay',
      cantons: [
        {
          code: '0101',
          name: 'Cuenca',
          provinceCode: '01',
          parishes: [
            { code: '010101', name: 'Bellavista', cantonCode: '0101', type: 'URBANA' },
            { code: '010102', name: 'Cañaribamba', cantonCode: '0101', type: 'URBANA' },
            { code: '010103', name: 'El Batán', cantonCode: '0101', type: 'URBANA' },
            { code: '010104', name: 'El Sagrario', cantonCode: '0101', type: 'URBANA' },
            { code: '010105', name: 'El Vecino', cantonCode: '0101', type: 'URBANA' },
            { code: '010106', name: 'Gil Ramírez Dávalos', cantonCode: '0101', type: 'URBANA' },
            { code: '010107', name: 'Huayna Cápac', cantonCode: '0101', type: 'URBANA' },
            { code: '010108', name: 'Machángara', cantonCode: '0101', type: 'URBANA' },
            { code: '010109', name: 'Monay', cantonCode: '0101', type: 'URBANA' },
            { code: '010110', name: 'San Blas', cantonCode: '0101', type: 'URBANA' },
            { code: '010111', name: 'San Sebastián', cantonCode: '0101', type: 'URBANA' },
            { code: '010112', name: 'Sucre', cantonCode: '0101', type: 'URBANA' },
            { code: '010113', name: 'Totoracocha', cantonCode: '0101', type: 'URBANA' },
            { code: '010114', name: 'Yanuncay', cantonCode: '0101', type: 'URBANA' },
            { code: '010115', name: 'Hermano Miguel', cantonCode: '0101', type: 'URBANA' }
          ]
        },
        {
          code: '0102',
          name: 'Girón',
          provinceCode: '01',
          parishes: [
            { code: '010201', name: 'Girón', cantonCode: '0102', type: 'URBANA' },
            { code: '010250', name: 'Asunción', cantonCode: '0102', type: 'RURAL' },
            { code: '010251', name: 'San Gerardo', cantonCode: '0102', type: 'RURAL' }
          ]
        }
      ]
    },
    {
      code: '17',
      name: 'Pichincha',
      cantons: [
        {
          code: '1701',
          name: 'Quito',
          provinceCode: '17',
          parishes: [
            // Parroquias urbanas
            { code: '170101', name: 'Belisario Quevedo', cantonCode: '1701', type: 'URBANA' },
            { code: '170102', name: 'Carcelén', cantonCode: '1701', type: 'URBANA' },
            { code: '170103', name: 'Centro Histórico', cantonCode: '1701', type: 'URBANA' },
            { code: '170104', name: 'Cochapamba', cantonCode: '1701', type: 'URBANA' },
            { code: '170105', name: 'Comité del Pueblo', cantonCode: '1701', type: 'URBANA' },
            { code: '170106', name: 'Cotocollao', cantonCode: '1701', type: 'URBANA' },
            { code: '170107', name: 'Chilibulo', cantonCode: '1701', type: 'URBANA' },
            { code: '170108', name: 'Chillogallo', cantonCode: '1701', type: 'URBANA' },
            { code: '170109', name: 'Chimbacalle', cantonCode: '1701', type: 'URBANA' },
            { code: '170110', name: 'El Condado', cantonCode: '1701', type: 'URBANA' },
            { code: '170111', name: 'Guamaní', cantonCode: '1701', type: 'URBANA' },
            { code: '170112', name: 'Iñaquito', cantonCode: '1701', type: 'URBANA' },
            { code: '170113', name: 'Itchimbía', cantonCode: '1701', type: 'URBANA' },
            { code: '170114', name: 'Jipijapa', cantonCode: '1701', type: 'URBANA' },
            { code: '170115', name: 'Kennedy', cantonCode: '1701', type: 'URBANA' },
            { code: '170116', name: 'La Argelia', cantonCode: '1701', type: 'URBANA' },
            { code: '170117', name: 'La Concepción', cantonCode: '1701', type: 'URBANA' },
            { code: '170118', name: 'La Ecuatoriana', cantonCode: '1701', type: 'URBANA' },
            { code: '170119', name: 'La Ferroviaria', cantonCode: '1701', type: 'URBANA' },
            { code: '170120', name: 'La Libertad', cantonCode: '1701', type: 'URBANA' },
            { code: '170121', name: 'La Magdalena', cantonCode: '1701', type: 'URBANA' },
            { code: '170122', name: 'La Mena', cantonCode: '1701', type: 'URBANA' },
            { code: '170123', name: 'Mariscal Sucre', cantonCode: '1701', type: 'URBANA' },
            { code: '170124', name: 'Ponceano', cantonCode: '1701', type: 'URBANA' },
            { code: '170125', name: 'Puengasí', cantonCode: '1701', type: 'URBANA' },
            { code: '170126', name: 'Quitumbe', cantonCode: '1701', type: 'URBANA' },
            { code: '170127', name: 'Rumipamba', cantonCode: '1701', type: 'URBANA' },
            { code: '170128', name: 'San Bartolo', cantonCode: '1701', type: 'URBANA' },
            { code: '170129', name: 'San Isidro del Inca', cantonCode: '1701', type: 'URBANA' },
            { code: '170130', name: 'San Juan', cantonCode: '1701', type: 'URBANA' },
            { code: '170131', name: 'Solanda', cantonCode: '1701', type: 'URBANA' },
            { code: '170132', name: 'Turubamba', cantonCode: '1701', type: 'URBANA' },
            
            // Parroquias rurales
            { code: '170150', name: 'Alangasí', cantonCode: '1701', type: 'RURAL' },
            { code: '170151', name: 'Amaguaña', cantonCode: '1701', type: 'RURAL' },
            { code: '170152', name: 'Atahualpa', cantonCode: '1701', type: 'RURAL' },
            { code: '170153', name: 'Calacalí', cantonCode: '1701', type: 'RURAL' },
            { code: '170154', name: 'Calderón', cantonCode: '1701', type: 'RURAL' },
            { code: '170155', name: 'Conocoto', cantonCode: '1701', type: 'RURAL' },
            { code: '170156', name: 'Cumbayá', cantonCode: '1701', type: 'RURAL' },
            { code: '170157', name: 'Chavezpamba', cantonCode: '1701', type: 'RURAL' },
            { code: '170158', name: 'Checa', cantonCode: '1701', type: 'RURAL' },
            { code: '170159', name: 'El Quinche', cantonCode: '1701', type: 'RURAL' },
            { code: '170160', name: 'Gualea', cantonCode: '1701', type: 'RURAL' },
            { code: '170161', name: 'Guangopolo', cantonCode: '1701', type: 'RURAL' },
            { code: '170162', name: 'Guayllabamba', cantonCode: '1701', type: 'RURAL' },
            { code: '170163', name: 'La Merced', cantonCode: '1701', type: 'RURAL' },
            { code: '170164', name: 'Llano Chico', cantonCode: '1701', type: 'RURAL' },
            { code: '170165', name: 'Lloa', cantonCode: '1701', type: 'RURAL' },
            { code: '170166', name: 'Nanegal', cantonCode: '1701', type: 'RURAL' },
            { code: '170167', name: 'Nanegalito', cantonCode: '1701', type: 'RURAL' },
            { code: '170168', name: 'Nayón', cantonCode: '1701', type: 'RURAL' },
            { code: '170169', name: 'Nono', cantonCode: '1701', type: 'RURAL' },
            { code: '170170', name: 'Pacto', cantonCode: '1701', type: 'RURAL' },
            { code: '170171', name: 'Pedro Moncayo', cantonCode: '1701', type: 'RURAL' },
            { code: '170172', name: 'Perucho', cantonCode: '1701', type: 'RURAL' },
            { code: '170173', name: 'Pifo', cantonCode: '1701', type: 'RURAL' },
            { code: '170174', name: 'Píntag', cantonCode: '1701', type: 'RURAL' },
            { code: '170175', name: 'Pomasqui', cantonCode: '1701', type: 'RURAL' },
            { code: '170176', name: 'Puéllaro', cantonCode: '1701', type: 'RURAL' },
            { code: '170177', name: 'Puembo', cantonCode: '1701', type: 'RURAL' },
            { code: '170178', name: 'San Antonio', cantonCode: '1701', type: 'RURAL' },
            { code: '170179', name: 'San José de Minas', cantonCode: '1701', type: 'RURAL' },
            { code: '170180', name: 'Tababela', cantonCode: '1701', type: 'RURAL' },
            { code: '170181', name: 'Tumbaco', cantonCode: '1701', type: 'RURAL' },
            { code: '170182', name: 'Yaruquí', cantonCode: '1701', type: 'RURAL' },
            { code: '170183', name: 'Zámbiza', cantonCode: '1701', type: 'RURAL' }
          ]
        },
        {
          code: '1702',
          name: 'Cayambe',
          provinceCode: '17',
          parishes: [
            { code: '170201', name: 'Cayambe', cantonCode: '1702', type: 'URBANA' },
            { code: '170250', name: 'Ascázubi', cantonCode: '1702', type: 'RURAL' },
            { code: '170251', name: 'Cangahua', cantonCode: '1702', type: 'RURAL' },
            { code: '170252', name: 'Olmedo', cantonCode: '1702', type: 'RURAL' },
            { code: '170253', name: 'Otón', cantonCode: '1702', type: 'RURAL' },
            { code: '170254', name: 'Santa Rosa de Cusubamba', cantonCode: '1702', type: 'RURAL' }
          ]
        }
      ]
    },
    {
      code: '09',
      name: 'Guayas',
      cantons: [
        {
          code: '0901',
          name: 'Guayaquil',
          provinceCode: '09',
          parishes: [
            // Parroquias urbanas principales
            { code: '090101', name: 'Ayacucho', cantonCode: '0901', type: 'URBANA' },
            { code: '090102', name: 'Bolívar', cantonCode: '0901', type: 'URBANA' },
            { code: '090103', name: 'Carbo', cantonCode: '0901', type: 'URBANA' },
            { code: '090104', name: 'Febres Cordero', cantonCode: '0901', type: 'URBANA' },
            { code: '090105', name: 'García Moreno', cantonCode: '0901', type: 'URBANA' },
            { code: '090106', name: 'Letamendi', cantonCode: '0901', type: 'URBANA' },
            { code: '090107', name: 'Nueve de Octubre', cantonCode: '0901', type: 'URBANA' },
            { code: '090108', name: 'Olmedo', cantonCode: '0901', type: 'URBANA' },
            { code: '090109', name: 'Roca', cantonCode: '0901', type: 'URBANA' },
            { code: '090110', name: 'Rocafuerte', cantonCode: '0901', type: 'URBANA' },
            { code: '090111', name: 'Sucre', cantonCode: '0901', type: 'URBANA' },
            { code: '090112', name: 'Tarqui', cantonCode: '0901', type: 'URBANA' },
            { code: '090113', name: 'Urdaneta', cantonCode: '0901', type: 'URBANA' },
            { code: '090114', name: 'Ximena', cantonCode: '0901', type: 'URBANA' },
            { code: '090115', name: 'Pascuales', cantonCode: '0901', type: 'URBANA' },
            { code: '090116', name: 'Chongón', cantonCode: '0901', type: 'RURAL' },
            { code: '090117', name: 'Juan Gómez Rendón', cantonCode: '0901', type: 'RURAL' },
            { code: '090118', name: 'Morro', cantonCode: '0901', type: 'RURAL' },
            { code: '090119', name: 'Playas', cantonCode: '0901', type: 'RURAL' },
            { code: '090120', name: 'Posorja', cantonCode: '0901', type: 'RURAL' },
            { code: '090121', name: 'Puna', cantonCode: '0901', type: 'RURAL' },
            { code: '090122', name: 'Tenguel', cantonCode: '0901', type: 'RURAL' }
          ]
        }
      ]
    }
  ];

  // Obtener todas las provincias
  static getProvinces(): Array<{ value: string; label: string }> {
    return this.ECUADOR_LOCATIONS.map(province => ({
      value: province.name,
      label: province.name
    }));
  }

  // Obtener cantones por provincia
  static getCantonsByProvince(provinceName: string): Array<{ value: string; label: string }> {
    const province = this.ECUADOR_LOCATIONS.find(p => p.name === provinceName);
    if (!province) return [];
    
    return province.cantons.map(canton => ({
      value: canton.name,
      label: canton.name
    }));
  }

  // Obtener parroquias por cantón
  static getParishesByCanton(provinceName: string, cantonName: string): Array<{ value: string; label: string; type: string }> {
    const province = this.ECUADOR_LOCATIONS.find(p => p.name === provinceName);
    if (!province) return [];
    
    const canton = province.cantons.find(c => c.name === cantonName);
    if (!canton) return [];
    
    return canton.parishes.map(parish => ({
      value: parish.name,
      label: parish.name,
      type: parish.type
    }));
  }

  // Obtener parroquias urbanas solamente
  static getUrbanParishesByCanton(provinceName: string, cantonName: string): Array<{ value: string; label: string }> {
    return this.getParishesByCanton(provinceName, cantonName)
      .filter(parish => parish.type === 'URBANA')
      .map(({ value, label }) => ({ value, label }));
  }

  // Obtener parroquias rurales solamente
  static getRuralParishesByCanton(provinceName: string, cantonName: string): Array<{ value: string; label: string }> {
    return this.getParishesByCanton(provinceName, cantonName)
      .filter(parish => parish.type === 'RURAL')
      .map(({ value, label }) => ({ value, label }));
  }

  // Validar que una ubicación existe
  static validateLocation(provinceName: string, cantonName?: string, parishName?: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    const province = this.ECUADOR_LOCATIONS.find(p => p.name === provinceName);
    if (!province) {
      errors.push(`Provincia "${provinceName}" no encontrada`);
      return { isValid: false, errors };
    }
    
    if (cantonName) {
      const canton = province.cantons.find(c => c.name === cantonName);
      if (!canton) {
        errors.push(`Cantón "${cantonName}" no encontrado en ${provinceName}`);
        return { isValid: false, errors };
      }
      
      if (parishName) {
        const parish = canton.parishes.find(p => p.name === parishName);
        if (!parish) {
          errors.push(`Parroquia "${parishName}" no encontrada en ${cantonName}, ${provinceName}`);
          return { isValid: false, errors };
        }
      }
    }
    
    return { isValid: true, errors: [] };
  }

  // Buscar ubicaciones por texto
  static searchLocations(query: string): Array<{
    type: 'PROVINCE' | 'CANTON' | 'PARISH';
    name: string;
    fullPath: string;
    province?: string;
    canton?: string;
  }> {
    const results: Array<{
      type: 'PROVINCE' | 'CANTON' | 'PARISH';
      name: string;
      fullPath: string;
      province?: string;
      canton?: string;
    }> = [];
    
    const normalizedQuery = query.toLowerCase();
    
    this.ECUADOR_LOCATIONS.forEach(province => {
      // Buscar provincias
      if (province.name.toLowerCase().includes(normalizedQuery)) {
        results.push({
          type: 'PROVINCE',
          name: province.name,
          fullPath: province.name
        });
      }
      
      province.cantons.forEach(canton => {
        // Buscar cantones
        if (canton.name.toLowerCase().includes(normalizedQuery)) {
          results.push({
            type: 'CANTON',
            name: canton.name,
            fullPath: `${canton.name}, ${province.name}`,
            province: province.name
          });
        }
        
        canton.parishes.forEach(parish => {
          // Buscar parroquias
          if (parish.name.toLowerCase().includes(normalizedQuery)) {
            results.push({
              type: 'PARISH',
              name: parish.name,
              fullPath: `${parish.name}, ${canton.name}, ${province.name}`,
              province: province.name,
              canton: canton.name
            });
          }
        });
      });
    });
    
    return results.slice(0, 20); // Limitar resultados
  }

  // Obtener información completa de una ubicación
  static getLocationInfo(provinceName: string, cantonName?: string, parishName?: string): {
    province?: Province;
    canton?: Canton;
    parish?: Parish;
  } {
    const province = this.ECUADOR_LOCATIONS.find(p => p.name === provinceName);
    if (!province) return {};
    
    let canton: Canton | undefined;
    let parish: Parish | undefined;
    
    if (cantonName) {
      canton = province.cantons.find(c => c.name === cantonName);
      
      if (canton && parishName) {
        parish = canton.parishes.find(p => p.name === parishName);
      }
    }
    
    return { province, canton, parish };
  }

  // Formatear dirección completa
  static formatAddress(components: {
    calle?: string;
    numero?: string;
    sector?: string;
    parroquia?: string;
    canton?: string;
    provincia?: string;
    referencia?: string;
  }): string {
    const parts: string[] = [];
    
    if (components.calle) {
      let address = components.calle;
      if (components.numero) {
        address += ` ${components.numero}`;
      }
      parts.push(address);
    }
    
    if (components.sector) {
      parts.push(components.sector);
    }
    
    if (components.parroquia) {
      parts.push(components.parroquia);
    }
    
    if (components.canton) {
      parts.push(components.canton);
    }
    
    if (components.provincia) {
      parts.push(components.provincia);
    }
    
    if (components.referencia) {
      parts.push(`(Ref: ${components.referencia})`);
    }
    
    return parts.join(', ');
  }
}