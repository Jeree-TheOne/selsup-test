import React from 'react';

interface Param {
  id: number;
  name: string;
  type?: string;
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors?: unknown[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  values: Record<number, string>;
}

export default class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const initialValues = props.params.reduce((acc, param) => {
      const foundValue = props.model.paramValues.find(pv => pv.paramId === param.id);
      acc[param.id] = foundValue?.value || '';
      return acc;
    }, {} as Record<number, string>);
    
    this.state = { values: initialValues };
  }

  private handleChange = (paramId: number, value: string) => {
    this.setState(prev => ({
      values: { ...prev.values, [paramId]: value }
    }));
  };

  public getModel(): Model {
    return {
      ...this.props.model,
      paramValues: Object.entries(this.state.values).map(([paramId, value]) => ({
        paramId: Number(paramId),
        value
      }))
    };
  }

  render() {
    return (
      <div className="param-editor">
        {this.props.params.map(param => (
          <div key={param.id} className="param-group">
            <label className="param-label">{param.name}</label>
            <input
              type={param.type || 'text'}
              value={this.state.values[param.id]}
              onChange={(e) => this.handleChange(param.id, e.target.value)}
              className="param-input"
            />
          </div>
        ))}
      </div>
    );
  }
}
